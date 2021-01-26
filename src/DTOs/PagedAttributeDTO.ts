import { AttributeDTO } from './AttributeDTO';
import { PageResultDTO } from './PageResultDTO';

export class PagedAttributeDTO {
    public PageResult: PageResultDTO = new PageResultDTO();
    public Attributes: AttributeDTO[] = [];
}