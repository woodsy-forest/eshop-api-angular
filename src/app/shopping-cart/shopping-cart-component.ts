import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { ShoppingCartCommonService } from '../../services/shopping-cart-common.service';
import { ShoppingCartService } from './shopping-cart.service';
import { environment } from '../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ConstantCartMode } from '../../core/constants/CartMode';
import { ShoppingCartItemDTO } from 'src/DTOs/ShoppingCartItemDTO';
import { ShoppingCartDTO } from '../../DTOs/ShoppingCartDTO';
import { AuthService } from '../../services/auth.service';
import { TokenDTO } from '../../DTOs/TokenDTO';
import { CustomerCommonService } from '../../services/customer-common.service'; 
import { CountryCommonService } from '../../services/country-common.service';
import { StateProvinceCommonService } from '../../services/state-province-common.service';
import { OrderCommonService } from '../../services/order-common.service';
import { CustomerDTO } from '../../DTOs/CustomerDTO';
import { CountryDTO } from '../../DTOs/CountryDTO';
import { StateProvinceDTO } from '../../DTOs/StateProvinceDTO';
import { ShippingRateDTO } from '../../DTOs/ShippingRateDTO';
import { PaymentMethodDTO } from '../../DTOs/PaymentMethodDTO';
import { CreateOrderDTO } from '../../DTOs/CreateOrderDTO';
import { Router } from "@angular/router";
//PayPal
import { IPayPalConfig, ICreateOrderRequest, ITransactionItem } from 'ngx-paypal';

@Component({
    selector: 'shopping-cart',
    templateUrl: './shopping-cart-component.html'
  })
export class ShoppingCartComponent  implements OnInit, OnDestroy { 

  public Mode: string =  ConstantCartMode.Cart;
  public ShowLoading: boolean = false;
  public shoppingCartDTO: ShoppingCartDTO = new ShoppingCartDTO();
  public IsAuthenticated: boolean = false;
  public PageTitle: string = "Shopping Cart";
  public ShowTotalSummary: boolean = false;
  public customerDTO: CustomerDTO = new CustomerDTO();
  public billingCountryDTOs: CountryDTO[] = [];
  public billingStateProvinceDTOs: StateProvinceDTO[] = [];
  public shippingCountryDTOs: CountryDTO[] = [];
  public shippingStateProvinceDTOs: StateProvinceDTO[] = [];
  public ShowLoadingShippingStateProvinces: boolean = false;
  public ShowLoadingBillingStateProvinces: boolean = false;
  public ShowLoadingtateProvinces: boolean = false;
  public ShowBillingAddress: boolean = false;
  public ShowShippingAddress: boolean = false;
  public ShowShippingRates: boolean = false;
  public ShowPaymentMethod: boolean = false;
  public selectedShippingRate: number = 0;
  public shippingRateDTOs: ShippingRateDTO[] = [];
  public paymentMethodDTOs: PaymentMethodDTO[] = [];
  public selectedPaymentMethod: number = 0;
  public reCaptchaResponse: string = '';
  public payPalConfig?: IPayPalConfig;
  public ShowCreateOrderButton: boolean = false;
  public ShowPayPalButtons: boolean = false;
  public ShowRecaptcha: boolean = false;
  public PaymentReference: string = '';

  constructor (
    private shoppingCartCommonService: ShoppingCartCommonService,
    private shoppingCartService: ShoppingCartService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: any,
    private titleService: Title,
    private countryCommonService: CountryCommonService,
    private stateProvinceCommonService: StateProvinceCommonService,
    private customerCommonService: CustomerCommonService,
    private orderCommonService: OrderCommonService,
    private router: Router

  ) {


  }

  ngOnInit(): void { 

    this.titleService.setTitle("eShop Api Documentation: ShoppingCart Api");

    this.IsAuthenticated = this.authService.isLoggedIn()

    if (isPlatformServer(this.platformId)) {

      if (environment.debug_mode) {
          console.log("ShoppingCartComponent, the app is running on the server.");
      }

    }
    else {

      switch (this.Mode) {
        case ConstantCartMode.Cart: {
          this.getShoppingCart();
          break;
        }

        default: {
          //do nothing
          break;
        }
      }

    }

  }

  PayPalSmartPaymentButtons(): void {

    if (!this.ValidInputs()) {
      return;
    }

    //-------------------------------
    // PayPal Smart Buttons - begin
    //-------------------------------

    var items: ITransactionItem[] = [];
    for(var i=0;i<this.shoppingCartDTO.Items.length;i++){
      var item: ITransactionItem = {
                      name: this.shoppingCartDTO.Items[i].Name,
                      quantity: String(this.shoppingCartDTO.Items[i].Quantity),
                      unit_amount: {
                        currency_code: environment.paypal_currency,
                        value: String(this.shoppingCartDTO.Items[i].UnitPrice)
                      }
                    };
      items.push(item);

    }

    var cartId = this.shoppingCartCommonService.GetShoppingCartId();

    this.payPalConfig = {
      currency: environment.paypal_currency,
      clientId: environment.paypal_clientId,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            custom_id: cartId,
            amount: {
              currency_code: environment.paypal_currency,
              value: String(this.shoppingCartDTO.TotalToPay),
              breakdown: {
                item_total: {
                  currency_code: environment.paypal_currency,
                  value: String(this.shoppingCartDTO.TotalItems)
                },
                tax_total : {
                  currency_code: environment.paypal_currency,
                  value: String(this.shoppingCartDTO.TotalTax)
                },
                shipping  : {
                  currency_code: environment.paypal_currency,
                  value: String(this.shoppingCartDTO.TotalShipping)
                },
                discount  : {
                  currency_code: environment.paypal_currency,
                  value: String(this.shoppingCartDTO.TotalItemsDiscount + this.shoppingCartDTO.TotalOrderDiscount)
                },
              }
            },
            items: items,
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        if (environment.debug_mode) {
          console.log('onApprove - transaction was approved, but not authorized', data, actions);
        }
        actions.order.get().then((details:any) => {
          if (environment.debug_mode) {
            console.log('onApprove - you can get full order details inside onApprove: ', details);
          }
        });
      },
      onClientAuthorization: (data) => {
        if (environment.debug_mode) {
          console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        }
          //Setup ShippingRate and Customer Details, then 
          //redirect to the invoice, the order will be created by the WebHook
          if (environment.debug_mode) {
            console.log("onClientAuthorization, data.id: " + data.id);
          }
          this.PaymentReference = data.id;
          this.SubmitOrder();
        },
      onCancel: (data, actions) => {
        if (environment.debug_mode) {
          console.log('OnCancel', data, actions);
        }
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        if (environment.debug_mode) {
          console.log('onClick', data, actions);
          console.log("onClick, payPalConfig: " + JSON.stringify(this.payPalConfig));
        }
      },
    };

    //-------------------------------
    // PayPal Smart Buttons - end
    //-------------------------------

  }

  RemoveItem(item: ShoppingCartItemDTO): void {

    var cart: ShoppingCartDTO = new ShoppingCartDTO();
    cart.Id = this.shoppingCartCommonService.GetShoppingCartId();
    cart.Mode = ConstantCartMode.Cart;
    item.Quantity = 0; //remove item
    cart.Items.push(item);

    this.UpdateShoppingCart(cart);

  }

  DisplayTotalSummary(): void {
    this.ShowBillingAddress = false;
    this.ShowShippingAddress = false;
    this.ShowShippingRates = false;
    this.ShowPaymentMethod = false;
    this.ShowTotalSummary = !this.ShowTotalSummary;

    this.ShowCreateOrderButton = false;
    this.ShowPayPalButtons = false;
    this.ShowRecaptcha = false;
    if ((this.ShowTotalSummary) && (Number(this.selectedShippingRate)>0) && (Number(this.selectedPaymentMethod)>0)) {
        if (this.selectedPaymentMethod == 1) {
          this.ShowCreateOrderButton = true;
          this.ShowPayPalButtons = false;
          this.ShowRecaptcha = true;
      }

      if (this.selectedPaymentMethod == 2) {
          this.ShowCreateOrderButton = false;
          this.ShowPayPalButtons = true;
          this.ShowRecaptcha = false;
      }
    }
  }

  DisplayPaymentMethod(): void {
    this.ShowBillingAddress = false;
    this.ShowShippingAddress = false;
    this.ShowShippingRates = false;
    this.ShowPaymentMethod = !this.ShowPaymentMethod;
    this.ShowTotalSummary = false;

    //everytime it is opened then it need to reselect
    if (this.ShowPaymentMethod) {
      this.getPaymentMethod();
    }
  }

  CreateCheckMoneyOrder(): void{

    this.ShowLoading = true;

    var createOrderDTO = new CreateOrderDTO();
    createOrderDTO.CartId = this.shoppingCartDTO.Id;
    createOrderDTO.ReCaptchaResponse = this.reCaptchaResponse;

    this.orderCommonService.CreateCheckMoneyOrder(createOrderDTO)
    .subscribe(
      (response: number) => {

        if (environment.debug_mode) {
          console.log("CreateOrder, response: " + JSON.stringify(response)); 
        }

        var orderId = response;

        this.ShowLoading = false;
        alert("The order has been created.");
        //shopping cart now is empty
        this.shoppingCartDTO.Items = [];
        //clear cartId
        this.shoppingCartCommonService.ClearShoppingCartId();
        
        //redirect to the invoice
        this.router.navigateByUrl('cart/invoice/'+orderId);


      }
      ,
      (err: HttpErrorResponse) => {

        console.log(err);
        alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
        this.ShowLoading = false;

      });


  }


  CreatePayPalSmartPaymentOrder(): void{

    this.ShowLoading = true;

    var cartId = this.shoppingCartCommonService.GetShoppingCartId();
    var orderId = this.PaymentReference;

    this.orderCommonService.CreatePayPalSmartPaymentOrder(cartId, orderId)
    .subscribe(
      (response: number) => {

        if (environment.debug_mode) {
          console.log("CreatePayPalSmartPaymentOrder, response: " + JSON.stringify(response)); 
        }

        var orderId = response;

        this.ShowLoading = false;
        alert("The order has been created.");
        //shopping cart now is empty
        this.shoppingCartDTO.Items = [];
        //clear cartId
        this.shoppingCartCommonService.ClearShoppingCartId();
        
        //redirect to the invoice
        this.router.navigateByUrl('cart/invoice/'+orderId);


      }
      ,
      (err: HttpErrorResponse) => {

        console.log(err);
        alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
        this.ShowLoading = false;

      });


  }


  ValidInputs(): boolean {

        //Make sure Shipping Rate and Payment Method are selected. 
        if (this.selectedShippingRate === 0) {
          alert("Please select a Shipping Rate.");
          this.DisplayShippingRates();
          return false;
        }

        if (this.selectedPaymentMethod === 0) {
          alert("Please select a Payment Method.");
          this.DisplayPaymentMethod();
          return false;
        }
        
        // Check ReCatcha
        if ((this.ShowRecaptcha) && (!this.reCaptchaResponse)){
          alert("MESSAGE: Please, prove you are not a robot.");
          return false;
        }

        return true;
  }


  SubmitOrder(): void {

    if (!this.ValidInputs()) {
      return;
    }

    //Billing
    if (this.customerDTO.BillingStateProvinceCode?.length > 0) {
      this.customerDTO.BillingStateProvince = this.billingStateProvinceDTOs.filter(a => a.Abbreviation == this.customerDTO.BillingStateProvinceCode)[0].Name;
    }
    if (this.customerDTO.BillingCountryCode?.length > 0 ) {
      this.customerDTO.BillingCountry = this.billingCountryDTOs.filter(a => a.TwoLetterIsoCode == this.customerDTO.BillingCountryCode)[0].Name;
    }
    //Shipping
    if (this.customerDTO.ShippingStateProvinceCode?.length > 0 ) {
      this.customerDTO.ShippingStateProvince = this.shippingStateProvinceDTOs.filter(a => a.Abbreviation == this.customerDTO.ShippingStateProvinceCode)[0].Name;
    }
    if (this.customerDTO.ShippingCountryCode?.length > 0) {
      this.customerDTO.ShippingCountry = this.shippingCountryDTOs.filter(a => a.TwoLetterIsoCode == this.customerDTO.ShippingCountryCode)[0].Name;
    } 

    //update shopping cart - begin
    this.shoppingCartDTO.Mode = ConstantCartMode.Checkout;
    //billing
    this.shoppingCartDTO.BillingFirstName = this.customerDTO.BillingFirstName;
    this.shoppingCartDTO.BillingLastName = this.customerDTO.BillingLastName;
    this.shoppingCartDTO.BillingCompany = this.customerDTO.BillingCompany;
    this.shoppingCartDTO.BillingAddress1 = this.customerDTO.BillingAddress1;
    this.shoppingCartDTO.BillingAddress2 = this.customerDTO.BillingAddress2;
    this.shoppingCartDTO.BillingCity = this.customerDTO.BillingCity;
    this.shoppingCartDTO.BillingZipPostalCode = this.customerDTO.BillingZipPostalCode;
    this.shoppingCartDTO.BillingStateProvince = this.customerDTO.BillingStateProvince;
    this.shoppingCartDTO.BillingStateProvinceCode = this.customerDTO.BillingStateProvinceCode;
    this.shoppingCartDTO.BillingCountry = this.customerDTO.BillingCountry;
    this.shoppingCartDTO.BillingCountryCode = this.customerDTO.BillingCountryCode;
    //shipping
    this.shoppingCartDTO.ShippingSameAsBillingAddress = this.customerDTO.ShippingSameAsBillingAddress;
    this.shoppingCartDTO.ShippingFirstName = this.customerDTO.ShippingFirstName;
    this.shoppingCartDTO.ShippingLastName = this.customerDTO.ShippingLastName;
    this.shoppingCartDTO.ShippingCompany = this.customerDTO.ShippingCompany;
    this.shoppingCartDTO.ShippingAddress1 = this.customerDTO.ShippingAddress1;
    this.shoppingCartDTO.ShippingAddress2 = this.customerDTO.ShippingAddress2;
    this.shoppingCartDTO.ShippingCity = this.customerDTO.ShippingCity;
    this.shoppingCartDTO.ShippingZipPostalCode = this.customerDTO.ShippingZipPostalCode;
    this.shoppingCartDTO.ShippingStateProvince = this.customerDTO.ShippingStateProvince;
    this.shoppingCartDTO.ShippingStateProvinceCode = this.customerDTO.ShippingStateProvinceCode;
    this.shoppingCartDTO.ShippingCountry = this.customerDTO.ShippingCountry;
    this.shoppingCartDTO.ShippingCountryCode = this.customerDTO.ShippingCountryCode;

    //Payment Reference
    this.shoppingCartDTO.PaymentReference = this.PaymentReference;

    this.shoppingCartCommonService.UpdateShoppingCartItem(this.shoppingCartDTO)
      .subscribe(
        (response: any) => {

          if (environment.debug_mode) {
            console.log("SubmitOrder, response: " + JSON.stringify(response));
            
          }

          if (environment.debug_mode) {
            console.log("SubmitOrder, selectedPaymentMethod: " + this.selectedPaymentMethod);
          }

          //create order - begin
          if (this.selectedPaymentMethod == 1) {
              this.CreateCheckMoneyOrder();
          }
          if (this.selectedPaymentMethod == 2) {
              this.CreatePayPalSmartPaymentOrder();
          }

          //create order - end

        }
        ,
        (err: HttpErrorResponse) => {

          console.log(err);
          alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
          this.ShowLoading = false;

        });

    //update shopping cart - end

  }

  resolved(captchaResponse: string) {
    if (environment.debug_mode) {
      console.log(`Resolved captcha with response: ${captchaResponse}`);
    }

    this.reCaptchaResponse = captchaResponse;

  }

  Continue(): void {
    if (this.ShowBillingAddress) {
      this.ShowBillingAddress = false;
      this.ShowShippingAddress = true;
      return;
    }
    if (this.ShowShippingAddress) {
      this.DisplayShippingRates();
      return;
    }
    if (this.ShowShippingRates) {

      if (this.selectedShippingRate == 0) {
        alert("Please select a Shipping Rate.");
        this.DisplayShippingRates();
        this.ShowShippingRates = true;
        return;
      }
  
      this.ShowShippingRates = false;
      this.DisplayPaymentMethod();
      this.ShowPaymentMethod = true;
      return;
    }
    if (this.ShowPaymentMethod) {

      if (this.selectedPaymentMethod == 0) {
        alert("Please select a Payment Method.");
        this.DisplayPaymentMethod();
        this.ShowPaymentMethod = true;
        return;
      }

      this.ShowPaymentMethod = false;
      this.ShowTotalSummary = true;
      return;
    }
  }

  selectShippingRate(): void {
    if (environment.debug_mode) {
      console.log("selectShippingRate, selected: " + this.selectedShippingRate);
    }

    for (var i=0;i<this.shippingRateDTOs.length;i++) {
      if (this.shippingRateDTOs[i].Id == this.selectedShippingRate) {
        this.shoppingCartDTO.TotalShipping = this.shippingRateDTOs[i].Price;
        this.shoppingCartDTO.ShippingMethod = this.shippingRateDTOs[i].Name;
        //recalculate - begin
        var newTotalOrderDiscount = 0;
        var totalToPay = this.shoppingCartDTO.TotalItems - this.shoppingCartDTO.TotalItemsDiscount + this.shoppingCartDTO.TotalTax + this.shoppingCartDTO.TotalShipping;
        if (this.shoppingCartDTO.TotalOrderDiscountUsePercentage) {
          newTotalOrderDiscount = totalToPay * this.shoppingCartDTO.TotalOrderDiscountPercentage / 100;
        }
        else {
          newTotalOrderDiscount = this.shoppingCartDTO.TotalOrderDiscountAmount;
        }
        this.shoppingCartDTO.TotalOrderDiscount = newTotalOrderDiscount;
        this.shoppingCartDTO.TotalToPay = totalToPay - newTotalOrderDiscount;
        //recalculate - end
        if (environment.debug_mode) {
          console.log("selectShippingRate, selected price: " + this.shippingRateDTOs[i].Price);
          console.log("selectShippingRate, selected name: " + this.shippingRateDTOs[i].Name);
          console.log("selectShippingRate, newTotalOrderDiscount: " + newTotalOrderDiscount);
        }
      }
    }

  }

  selectPaymentMethod(): void {

    if (environment.debug_mode) {
      console.log("selectPaymentMethod, selected: " + this.selectedPaymentMethod);
    }

    for (var i=0;i<this.paymentMethodDTOs.length;i++) {
      if (this.paymentMethodDTOs[i].Id == this.selectedPaymentMethod) {
        this.shoppingCartDTO.PaymentMethod = this.paymentMethodDTOs[i].Name;
      }
    }

    this.ShowRecaptcha = false;
    if (this.selectedPaymentMethod == 1) {
        this.ShowCreateOrderButton = true;
        this.ShowPayPalButtons = false;
        this.ShowRecaptcha = true;
    }

    if (this.selectedPaymentMethod == 2) {
        this.ShowCreateOrderButton = false;
        this.ShowPayPalButtons = true;
        this.ShowRecaptcha = false;
        //PayPay Smart Payment Buttons
        this.PayPalSmartPaymentButtons();
    }

  }

  DisplayBilligAddress(): void {
    this.ShowBillingAddress = !this.ShowBillingAddress;
    this.ShowShippingAddress = false;
    this.ShowShippingRates = false;
    this.ShowPaymentMethod = false;
    this.ShowTotalSummary = false;
  }

  DisplayShippingAddress(): void {
    this.ShowBillingAddress = false;
    this.ShowShippingAddress = !this.ShowShippingAddress;
    this.ShowShippingRates = false;
    this.ShowPaymentMethod = false;
    this.ShowTotalSummary = false;
  }

  DisplayShippingRates(): void {

    if ((this.customerDTO.ShippingCountryCode) || 
        (this.customerDTO.BillingCountryCode) && (this.customerDTO.ShippingSameAsBillingAddress)) {
        this.ShowBillingAddress = false;
        this.ShowShippingAddress = false;
        this.ShowShippingRates = !this.ShowShippingRates;
        this.ShowPaymentMethod = false;
        this.ShowTotalSummary = false;

        if (this.ShowShippingRates) {
          //every time they open this the rates have to be recalculated
          //because the address might have changed.
          this.getShippingRates();
        }


    }
    else {
      alert("Please select a shipping country or a billing country and tick same as billing address.");
      this.ShowBillingAddress = false;
      this.ShowShippingAddress = true;
      this.ShowShippingRates = false;
      this.ShowPaymentMethod = false;
      this.ShowTotalSummary = false;
    }


  }

  getPaymentMethod(): void {

    this.paymentMethodDTOs = [];

    var paymentMethod1DTO = new PaymentMethodDTO();
    paymentMethod1DTO.Id = 1;
    paymentMethod1DTO.Name = "Check / Money Order"
    this.paymentMethodDTOs.push(paymentMethod1DTO);

    var paymentMethod2DTO = new PaymentMethodDTO();
    paymentMethod2DTO.Id = 2;
    paymentMethod2DTO.Name = "PayPal Smart Payment Buttons"
    this.paymentMethodDTOs.push(paymentMethod2DTO);


    this.selectedPaymentMethod = 0;
    this.shoppingCartDTO.PaymentMethod = '';


  }

  getShippingRates(): void {

    this.shippingRateDTOs = [];

    //add shipping rates - begin
    var shippingRate1DTO = new ShippingRateDTO();
    shippingRate1DTO.Id = 1;
    shippingRate1DTO.Price = 0;
    shippingRate1DTO.Name = "Free Standard Delivery";
    this.shippingRateDTOs.push(shippingRate1DTO);

    var shippingRate2DTO = new ShippingRateDTO();
    shippingRate2DTO.Id = 2;
    shippingRate2DTO.Price = 5;
    shippingRate2DTO.Name = "Next Day Delivery [$5.00]";
    this.shippingRateDTOs.push(shippingRate2DTO);
    //add shipping rates - end


    this.selectedShippingRate = 0;
    this.shoppingCartDTO.TotalShipping = 0;
    this.shoppingCartDTO.ShippingMethod = '';

  }

  selectBillingCountry(): void {

    if (this.billingCountryDTOs.length>0) {
      var countryId = this.billingCountryDTOs.filter(c => c.TwoLetterIsoCode == this.customerDTO.BillingCountryCode)[0].Id;
      this.getBillingStateProvinces(countryId);
    }

  }

  selectShippingCountry(): void {

    if (this.shippingCountryDTOs.length>0) {
      var countryId = this.shippingCountryDTOs.filter(c => c.TwoLetterIsoCode == this.customerDTO.ShippingCountryCode)[0].Id;
      this.getShippingStateProvinces(countryId);
    }

  }

  changeInputQuantity(event: any, item: ShoppingCartItemDTO): void {
    if (environment.debug_mode) {
      console.log("changeInputQuantity, qty: " +  event.target.value);
      console.log("changeInputQuantity, item: " + JSON.stringify(item));
    }

    var newQty = Number(event.target.value);

    var cart: ShoppingCartDTO = new ShoppingCartDTO();
    cart.Id = this.shoppingCartCommonService.GetShoppingCartId();
    cart.Mode = ConstantCartMode.Cart;
    item.Quantity = newQty;

    cart.Items.push(item);

    this.UpdateShoppingCart(cart);


  }

  ProceedToCheckout(): void {

    if (!this.IsAuthenticated) {
      alert("To checkout, you must login first.");
      return;
    }

    //Load Customer Details - begin
    var tokenDTO: TokenDTO = this.authService.getUserDetails();
    this.GetCustomerCountry(tokenDTO.customerid)

    //Load Customer Details - end
    this.ShowBillingAddress = true;

    this.PageTitle = "Checkout";

    this.Mode = ConstantCartMode.Checkout;
  }

  GetCustomerCountry(customerId: number): void {

    this.ShowLoading = true;
    this.customerCommonService.GetCustomerById(customerId)
    .subscribe(
      (response: CustomerDTO) => {
        if (environment.debug_mode) {
          console.log("GetCustomer, response: " + JSON.stringify(response));
        }

        this.customerDTO = response;

        //Load Countries - begin
        this.countryCommonService.GetCountries()
        .subscribe(
          (response: CountryDTO[]) => {
            if (environment.debug_mode) {
              console.log("GetCountry, response: " + JSON.stringify(response));
            }

            this.billingCountryDTOs = response;
            this.shippingCountryDTOs = response;

            this.ShowLoading = false;

            if (this.customerDTO.BillingCountryCode) {
              var countryId = this.billingCountryDTOs.filter(c => c.TwoLetterIsoCode == this.customerDTO.BillingCountryCode)[0].Id;
              this.getBillingStateProvinces(countryId);
            }

            if (this.customerDTO.ShippingCountryCode) {
              var countryId =  this.billingCountryDTOs.filter(c => c.TwoLetterIsoCode == this.customerDTO.ShippingCountryCode)[0].Id;
              this.getShippingStateProvinces(countryId);
            }

          }
          ,
          (error: HttpErrorResponse) => {
            console.log(error);
            alert("ERROR - STATUS:" + error.status + " - MESSAGE:" + error.error);
            this.ShowLoading = false;
          }
        );


        //Load Countries - end


        this.ShowLoading = false;
      }
      ,
      (error: HttpErrorResponse) => {
        console.log(error);
        alert("ERROR - STATUS:" + error.status + " - MESSAGE:" + error.error);
        this.ShowLoading = false;
      }
    );


  }


  getBillingStateProvinces(countryId: number): void {
        
    this.ShowLoadingBillingStateProvinces = true;

    this.billingStateProvinceDTOs = [];

    this.stateProvinceCommonService.GetStateProvincesByCountryId(countryId)
    .subscribe(
      (response: StateProvinceDTO[]) => {

          this.billingStateProvinceDTOs = response;

          if (this.billingStateProvinceDTOs.length>0) {
               this.customerDTO.BillingStateProvince = '';
          }
          else {
            this.customerDTO.BillingStateProvinceCode = '';
          }
   
          this.ShowLoadingBillingStateProvinces = false;

          if (!this.ShowLoadingBillingStateProvinces && !this.ShowLoadingShippingStateProvinces) {
            this.ShowLoadingtateProvinces = false;
          }

      }
      ,
      (error: HttpErrorResponse) => {
        console.log(error);
        alert("ERROR - STATUS:" + error.status + " - MESSAGE:" + error.error);
        this.ShowLoadingBillingStateProvinces = false;
      }
    );

  }

  getShippingStateProvinces(countryId: number): void {

    this.ShowLoadingShippingStateProvinces = true;

    this.shippingStateProvinceDTOs = [];

    this.stateProvinceCommonService.GetStateProvincesByCountryId(countryId)
    .subscribe(
      (response: StateProvinceDTO[]) => {

        this.shippingStateProvinceDTOs = response;

        if (this.shippingStateProvinceDTOs.length>0) {
          this.customerDTO.ShippingStateProvince = '';
        }
        else {
          this.customerDTO.ShippingStateProvinceCode = '';
        }

        this.ShowLoadingShippingStateProvinces = false;

        if (!this.ShowLoadingBillingStateProvinces && !this.ShowLoadingShippingStateProvinces) {
          this.ShowLoadingtateProvinces = false;
        }

      }
      ,
      (error: HttpErrorResponse) => {
        console.log(error);
        alert("ERROR - STATUS:" + error.status + " - MESSAGE:" + error.error);
        this.ShowLoadingShippingStateProvinces = false;
      }
    );

  }



  UpdateShoppingCart(cart: ShoppingCartDTO): void {

    this.ShowLoading = true;

    this.shoppingCartCommonService.UpdateShoppingCartItem(cart)
    .subscribe(
      (response: ShoppingCartDTO) => {

        if (environment.debug_mode) {
          console.log("getShoppingCart, response: " + JSON.stringify(response));
        }
      
        this.ShowLoading = false;
        this.shoppingCartDTO = response;

      }
      ,
      (err: HttpErrorResponse) => {

        console.log(err);
        alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
        this.ShowLoading = false;

      });

  }

  getShoppingCart(): void {

    this.ShowLoading = true;

    var cartId = this.shoppingCartCommonService.GetShoppingCartId();

    this.shoppingCartService.GetShoppingCart(cartId)
    .subscribe(
      (response: ShoppingCartDTO) => {

        if (environment.debug_mode) {
          console.log("getShoppingCart, response: " + JSON.stringify(response));
        }
      
        this.ShowLoading = false;
        this.shoppingCartDTO = response;

      }
      ,
      (err: HttpErrorResponse) => {

        console.log(err);
        alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
        this.ShowLoading = false;

      });

  }

  ngOnDestroy(): void {
      // unsubscribe to ensure no memory leaks
  }

}