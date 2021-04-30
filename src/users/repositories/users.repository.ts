import { Users } from '../entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';

@EntityRepository(Users)
export class usersRepository extends Repository<Users> {
  async createUser(createUserDto: CreateUserDto): Promise<Users> {
    const { firstName, lastName, email, password, role } = createUserDto;

    const users = new Users();
    users.firstName = firstName;
    users.lastName = lastName;
    users.password = password;
    users.email = email;
    users.role = role;
    await users.save();
    return users;
  }
}
