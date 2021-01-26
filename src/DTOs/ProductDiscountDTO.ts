export class ProductDiscountDTO {
    public Id: number = 0;
    public Name: string = '';
    public UsePercentage: boolean = false
    public DiscountPercentage: number = 0;
    public DiscountAmount: number = 0;  
    public StartDateUtc?: Date; 
    public EndDateUtc?: Date; 
}

