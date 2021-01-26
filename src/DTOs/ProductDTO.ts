import { ProductCategoryDTO } from './ProductCategoryDTO';
import { ProductPictureDTO } from './ProductPictureDTO';
import { ProductAttributeDTO } from './ProductAttributeDTO';
import { ProductDiscountDTO } from './ProductDiscountDTO';

export class ProductDTO {
    public Id: number = 0;
    public Name: string = '';
    public Sku: string = '';
    public ShortDescription: string = '';
    public FullDescription: string = '';
    public StockQuantity: number = 0;
    public Price: number = 0;
    public DiscountAmount: number = 0;
    public OldPrice: number = 0;
    public Weight: number = 0;
    public Length: number = 0;
    public Width: number = 0;
    public Height: number = 0;
    public TaxRate: number = 0;
    public DisplayOrder: number = 0;
    public Published: boolean = true;
    public CreatedOnUtc? : Date;
    public UpdatedOnUtc?: Date;
    public ManageInventoryType: number = 0;
    public Categories: ProductCategoryDTO[] = [];
    public Pictures: ProductPictureDTO[] = [];
    public Attributes: ProductAttributeDTO[] = [];
    public Discounts: ProductDiscountDTO[] =[];
    public Picture: ProductPictureDTO = new ProductPictureDTO();

}

