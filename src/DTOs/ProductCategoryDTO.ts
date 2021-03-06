import { PictureDTO} from './PictureDTO';

export class ProductCategoryDTO {
    public Id: number = 0;
    public Name: string = '';
    public Description: string = '';
    public Published: boolean = true;
    public DisplayOrder: number = 0;
    public Picture: PictureDTO = new PictureDTO();
    public ParentCategoryId: number = 0;
}

