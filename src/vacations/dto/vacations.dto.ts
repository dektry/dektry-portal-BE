import { IsNotEmpty, Length, MaxLength, MinLength } from 'class-validator';
import { UserEntity } from 'users/entity/user.entity';

export class SaveVacationDto {
  end: string;
  id: string | null;
  policy: string;
  reason: string;
  start: string;
  status: string;
  user: UserEntity;
}
