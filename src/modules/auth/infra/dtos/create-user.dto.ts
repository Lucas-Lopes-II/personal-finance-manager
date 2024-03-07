import { CreateUser } from '@users/application/usecases';

export class CreateUserDTO implements CreateUser.Input {
  name: string;
  email: string;
  password: string;
}
