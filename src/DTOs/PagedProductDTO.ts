import { ProductDTO } from './ProductDTO';
import { PageResultDTO } from './PageResultDTO';

export class PagedProductDTO {
    public PageResult: PageResultDTO = new PageResultDTO();
    public Products: ProductDTO[] = [];
}