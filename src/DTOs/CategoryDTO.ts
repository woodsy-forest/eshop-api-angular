import { PictureDTO } from './PictureDTO';

export class CategoryDTO {
    public Id: number = 0;
    public Name: string = '';
    public Description: string = '';
    public Published: boolean = true;
    public DisplayOrder: number = 0;
    public CreatedOnUtc?: Date;
    public UpdatedOnUtc?: Date;
    public Picture: PictureDTO = new PictureDTO();
    public ParentCategoryId: number = 0;
}

