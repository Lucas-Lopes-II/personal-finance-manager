import { BadRequestError } from '@shared/domain/errors';
import {
  ISODateValidation,
  MaxLengthFieldValidation,
  MinLengthFieldValidation,
  UUIDValidation,
  Validation,
  ValidationComposite,
  Validator,
} from '@shared/domain/validations';
import { randomUUID } from 'node:crypto';

export type FinanceAccountProps = {
  id: string;
  name: string;
  users: string[];
  date: string;
};

export interface IFinanceAccount {
  get id(): string;
  get name(): string;
  get users(): string[];
  get date(): string;
}

class FinanceAccount implements IFinanceAccount {
  private _id: string;
  private _name: string;
  private _users: string[];
  private _date: string;

  constructor(id: string, name: string, users: string[], date: string) {
    this._id = id || randomUUID();
    this._name = name;
    this._users = users || [];
    this._date = date || new Date().toISOString();
    this.validation();
  }

  get id(): string {
    return (this._id = this._id);
  }

  get name(): string {
    return this._name;
  }

  get users(): string[] {
    return this._users;
  }

  get date(): string {
    return this._date;
  }

  public toJSON(): FinanceAccountProps {
    return {
      id: this._id,
      name: this._name,
      date: this._date,
      users: this._users,
    };
  }

  private validation(): void {
    const validator = this.createValidator();
    validator.validate(this.toJSON());

    if (this._users.length <= 0) {
      throw new BadRequestError('users can not be empty');
    }

    this._users.forEach((id) => {
      const isNotCorrectUUID = !Validator.isUUID(id);
      if (isNotCorrectUUID) {
        throw new BadRequestError('users in invalid format');
      }
    });
  }

  private createValidator(): Validation {
    const validations: Validation<FinanceAccountProps>[] = [
      new UUIDValidation('id'),

      new MinLengthFieldValidation('name', 2),
      new MaxLengthFieldValidation('name', 100),

      new ISODateValidation('date'),
    ];

    return new ValidationComposite(validations);
  }
}

export class FinanceAccountFactory {
  public static create(props: FinanceAccountProps): FinanceAccount {
    return new FinanceAccount(props.id, props.name, props.users, props.date);
  }
}
