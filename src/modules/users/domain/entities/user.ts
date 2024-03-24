import { randomUUID } from 'node:crypto';
import { Email } from '@shared/domain/velue-objects';
import {
  MaxLengthFieldValidation,
  MinLengthFieldValidation,
  UUIDValidation,
  Validation,
  ValidationComposite,
} from '@shared/domain/validations';
import { ForbiddenError } from '@shared/domain/errors';

export type UserProps = {
  id?: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  password?: string;
};

export interface IUser {
  get id(): string;
  get name(): string;
  get email(): string;
  get password(): string;
  get isAdmin(): boolean;
  toJSON(): UserProps;
  changePassword(email: string): void;
  becomeAdmin(actionDoneBy: IUser): void;
}

class User implements IUser {
  private _id: string;
  private _name: string;
  private _email: Email;
  private _password: string;
  private _isAdmin: boolean;

  constructor(
    id: string,
    name: string,
    email: Email,
    password: string,
    isAdmin: boolean,
  ) {
    this._id = id || randomUUID();
    this._name = name;
    this._email = email;
    this._password = password || null;
    this._isAdmin = isAdmin || false;
    this.validation();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email.value;
  }

  get isAdmin(): boolean {
    return this._isAdmin;
  }

  public becomeAdmin(actionDoneBy: IUser): void {
    if (!actionDoneBy?.isAdmin) {
      throw new ForbiddenError('Action not allowed');
    }

    this._isAdmin = true;
  }

  get password(): string {
    return this._password;
  }

  public changePassword(newPassword: string): void {
    const validator = new MinLengthFieldValidation('password', 6);
    validator.validate({ password: newPassword });
    this._password = newPassword;
  }

  public toJSON(): UserProps {
    return {
      id: this._id,
      name: this._name,
      email: this._email.value,
      isAdmin: this._isAdmin,
      password: this._password,
    };
  }

  private validation(): void {
    const validator = createValidator();
    const data = this.toJSON();
    validator.validate(data);
  }
}

function createValidator(): Validation<UserProps> {
  const validations: Validation<UserProps>[] = [
    new UUIDValidation('id'),

    new MinLengthFieldValidation('name', 2),
    new MaxLengthFieldValidation('name', 100),

    new MinLengthFieldValidation('password', 6, false),
  ];

  return new ValidationComposite(validations);
}

export class UserFactory {
  public static create(props: UserProps): IUser {
    const email = new Email(props.email);

    return new User(props.id, props.name, email, props.password, props.isAdmin);
  }
}
