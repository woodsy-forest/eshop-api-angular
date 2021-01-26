import { ShoppingCartItemDTO } from './ShoppingCartItemDTO';

export class ShoppingCartDTO {

    public Id: string = '';
    public Mode: string = '';

    public BillingFirstName: string = '';
    public BillingLastName: string = '';
    public BillingCompany: string = '';
    public BillingAddress1: string = '';
    public BillingAddress2: string = '';
    public BillingCity: string = '';
    public BillingZipPostalCode: string = '';
    public BillingStateProvince: string = '';
    public BillingStateProvinceCode: string = '';
    public BillingCountry: string = '';
    public BillingCountryCode: string = '';


    public ShippingSameAsBillingAddress: boolean = false;
    public ShippingFirstName: string = '';
    public ShippingLastName: string = '';
    public ShippingCompany: string = '';
    public ShippingAddress1: string = '';
    public ShippingAddress2: string = '';
    public ShippingCity: string = '';
    public ShippingZipPostalCode: string ='';
    public ShippingStateProvince: string = '';
    public ShippingStateProvinceCode: string = '';
    public ShippingCountry: string = '';
    public ShippingCountryCode: string = '';

    public ShippingMethod: string = '';
    public TotalShipping: number = 0;

    public TotalItems: number = 0;
    public TotalItemsDiscount: number = 0;
    public TotalOrderDiscount: number = 0;
    public TotalTax: number = 0;

    public TotalOrderDiscountUsePercentage: boolean = false;
    public TotalOrderDiscountPercentage: number = 0;
    public TotalOrderDiscountAmount: number = 0;

    public TotalToPay: number = 0;
    public PaymentMethod: string = ''
    public PaymentReference: string = ''

    public CreatedOnUtc: Date = new Date();
    public UpdatedOnUtc: Date = new Date();

    public Items: ShoppingCartItemDTO[] = [];

}

