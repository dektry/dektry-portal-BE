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
// export class SaveArticleDto {
//   @MinLength(2, {
//     message: 'Title is too short',
//   })
//   @MaxLength(255, {
//     message: 'Title is too long',
//   })
//   title: string;

//   @IsNotEmpty({
//     message: 'Content must not be empty',
//   })
//   content: string;

//   edit_positions: IPositions[];
//   read_positions: IPositions[];
// }

// interface IAccess {
//   id: string;
//   name: string;
// }

// interface IGroup {
//   color: string;
//   id: string;
//   name: string;
// }
// interface IPositions {
//   access: IAccess[];
//   duties: string;
//   group: IGroup;
//   id: string;
//   name: string;
//   requirements: string;
//   salaryMaxLimit: number;
//   salaryMinLimit: number;
// }

// export class SearchValueDto {
//   value: string;
//   pagination: {
//     page: number;
//     pageSize: number;
//   };
//   permission: string;
//   userId: string;
// }
