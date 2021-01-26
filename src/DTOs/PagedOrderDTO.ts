import { OrderDTO } from './OrderDTO';
import { PageResultDTO } from './PageResultDTO';

export class PagedOrderDTO {
    public PageResult: PageResultDTO = new PageResultDTO();
    public Orders: OrderDTO[] = [];
}