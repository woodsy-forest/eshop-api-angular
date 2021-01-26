import { ProductAttributeValueDTO } from "./ProductAttributeValueDTO";

export class ProductAttributeDTO {
    public Id: number = 0;
    public Name: string = '';
    public DisplayOrder: number = 0;
    public PromptText: string = ''
    public IsRequired: boolean = false;
    public SelectedAttributeValueId: number = 0;
    public Values: ProductAttributeValueDTO[] = []; 

}
