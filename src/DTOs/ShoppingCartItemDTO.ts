import { PictureDTO } from "./PictureDTO";
import { ShoppingCartItemAttributeValueDTO } from './ShoppingCartItemAttributeValueDTO';

export class ShoppingCartItemDTO {

    public Id: number = 0;
    public Name: string = '';
    public Sku: string = '';
    public Picture: PictureDTO = new PictureDTO();
    public Quantity: number = 0;
    public UnitPrice: number = 0;
    public TaxRate: number = 0;
    public DiscountAmount: number = 0;
    public TotalItem: number = 0;
    public TotalToPay: number = 0;
    public AttributeValues: ShoppingCartItemAttributeValueDTO[] = [];

}