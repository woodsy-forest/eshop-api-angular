import { PictureDTO } from './PictureDTO';
import { PageResultDTO } from './PageResultDTO';

export class PagedPictureDTO {
    public PageResult: PageResultDTO = new PageResultDTO();
    public Pictures: PictureDTO[] = [];
}