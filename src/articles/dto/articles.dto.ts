import { IsNotEmpty, Length } from 'class-validator';
import { PositionEntity } from '../../users/entity/position.entity';

export class SaveArticleDto {
  @IsNotEmpty()
  @Length(2, 255)
  title: string;

  @IsNotEmpty()
  content: string;

  edit_positions: PositionEntity[];
  read_positions: PositionEntity[];
}

export class SearchValueDto {
  value: string;
}
