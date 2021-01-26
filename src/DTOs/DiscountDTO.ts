import { DiscountAppliedToProductDTO } from '../DTOs/DiscountAppliedToProductDTO';

export class DiscountDTO {
    public Id: number = 0;
    public Name: string = '';
    public DiscountType: number = 0 //0 for AssignedToOrderTotal   1 for AssignedToProducts
    public UsePercentage: boolean = false
    public DiscountPercentage: number = 0;
    public DiscountAmount: number = 0;  
    public StartDateUtc?: Date; 
    public EndDateUtc?: Date; 
    public Products: DiscountAppliedToProductDTO[] = []; 
}

