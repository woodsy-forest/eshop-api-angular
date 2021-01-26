import { SettingDTO } from './SettingDTO';
import { PageResultDTO } from './PageResultDTO';

export class PagedSettingDTO {
    public PageResult: PageResultDTO = new PageResultDTO();
    public Settings: SettingDTO[] = [];
}