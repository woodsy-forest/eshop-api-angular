import { CustomerDTO } from './CustomerDTO';
import { PageResultDTO } from './PageResultDTO';

export class PagedCustomerDTO {
    public PageResult: PageResultDTO = new PageResultDTO();
    public Customers: CustomerDTO[] = [];
}