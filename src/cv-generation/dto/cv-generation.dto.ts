import { IsNotEmpty } from 'class-validator';

import { noTemplate } from '../constants/messages';

export class CvGenerationDto {
  @IsNotEmpty({ message: noTemplate })
  template: string;
}
