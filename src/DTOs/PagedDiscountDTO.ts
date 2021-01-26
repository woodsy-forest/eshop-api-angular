import { DiscountDTO } from './DiscountDTO';
import { PageResultDTO } from './PageResultDTO';

export class PagedDiscountDTO {
    public PageResult: PageResultDTO = new PageResultDTO();
    public Discounts: DiscountDTO[] = [];
}