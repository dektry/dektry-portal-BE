import { RoleEntity } from 'src/users/entity/role.entity';

export interface requestUser {
  firstName: string;
  lastName: string;
  email: string;
  role: RoleEntity;
}
