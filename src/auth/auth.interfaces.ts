import { RoleEntity } from 'users/entity/role.entity';

export interface RequestUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: RoleEntity;
  career: any;
}

export interface IAuthUser extends RequestUser {
  jwt: any;
}
