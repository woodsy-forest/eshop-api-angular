import { RoleDTO } from './RoleDTO';

export class CustomerDTO {
    public Id: number = 0;
    public Email: string = '';
    public PhoneNumber: string = '';
    //Billing Address
    public BillingFirstName: string = '';
    public BillingLastName: string = '';
    public BillingCompany: string = '';
    public BillingAddress1: string = '';
    public BillingAddress2: string = '';
    public BillingCity: string = '';
    public BillingZipPostalCode: string = '';
    public BillingStateProvince: string = '';
    public BillingStateProvinceCode: string = '';
    public BillingCountry: string = '';
    public BillingCountryCode: string = '';
    //Shipping Address
    public ShippingSameAsBillingAddress: boolean = false;
    public ShippingFirstName: string = '';
    public ShippingLastName: string = '';
    public ShippingCompany: string = '';
    public ShippingAddress1: string = '';
    public ShippingAddress2: string = '';
    public ShippingCity: string = '';
    public ShippingZipPostalCode: string = '';
    public ShippingStateProvince: string = '';
    public ShippingStateProvinceCode: string = '';
    public ShippingCountry: string = '';
    public ShippingCountryCode: string = '';
    public CreatedOnUtc?: Date;
    public IsActive: boolean = false;
    public FailedLoginAttempts: number = 0;
    public LastLoginDateUtc?: Date;
    public CustomerGuid: string = '00000000-0000-0000-0000-000000000000';
    public Roles: RoleDTO[] = [];

}
