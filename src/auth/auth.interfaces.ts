import { RoleEntity } from 'users/entity/role.entity';

export interface RequestUser {
  firstName: string;
  lastName: string;
  email: string;
  role: RoleEntity;
}
