export interface RequestUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: any;
  career: any;
}

export interface IAuthUser extends RequestUser {
  jwt: any;
}
