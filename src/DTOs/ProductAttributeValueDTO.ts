import { PictureDTO } from "./PictureDTO";

export class ProductAttributeValueDTO {
    public Id: number = 0;
    public Name: string = '';
    public PriceAdjustment: number = 0;
    public PriceAdjustmentUsePercentage: boolean = false;
    public WeightAdjustment: number = 0;
    public Quantity: number = 0;
    public IsPreSelected: boolean = false;
    public DisplayOrder: number = 0;
    public Picture: PictureDTO = new PictureDTO();
}