import { BadRequestError } from '../../errors';
import { Validator } from '../../validations';

export class Email {
  constructor(private readonly email: string) {
    this.validation(email);
    this.email = email.toLowerCase();
  }

  get value(): string {
    return this.email;
  }

  private validation(email: string): void {
    const isValid = Validator.isEmail(email);

    if (!isValid) {
      throw new BadRequestError('email in invalid format');
    }

    if (email.length < 8) {
      throw new BadRequestError('email must contain at least 8 characters');
    }

    if (email.length > 100) {
      throw new BadRequestError(
        'email must contain a maximum of 100 characters',
      );
    }
  }
}
