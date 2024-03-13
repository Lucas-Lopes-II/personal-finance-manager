import { Month } from '@shared/domain/enums';
import {
  UUIDValidation,
  Validation,
  ValidationComposite,
  EnumValidation,
} from '@shared/domain/validations';
import { randomUUID } from 'node:crypto';

export type Summary = Array<{
  categoryName: string;
  total: string;
}>;

export type MothlyEntryReportProps = {
  id: string;
  month: Month;
  account: string;
  summary?: Summary;
};

export interface IMothlyEntryReport {
  get id(): string;
  get month(): Month;
  get account(): string;
  get summary(): Summary;
  toJSON(): MothlyEntryReportProps;
}

class MothlyEntryReport implements IMothlyEntryReport {
  private _id: string;
  private _month: Month;
  private _account: string;
  private _summary: Summary;

  constructor(id: string, month: Month, account: string, summary: Summary) {
    this._id = id || randomUUID();
    this._month = month;
    this._account = account;
    this._summary = summary;
    this.validation();
  }

  get id(): string {
    return this._id;
  }

  get month(): Month {
    return this._month;
  }

  get account(): string {
    return this._account;
  }

  get summary(): Summary {
    return this._summary;
  }

  public toJSON(): MothlyEntryReportProps {
    return {
      id: this._id,
      month: this._month,
      account: this._account,
      summary: this._summary,
    };
  }

  private validation(): void {
    const validator = this.createValidator();
    validator.validate(this.toJSON());
  }

  private createValidator(): Validation {
    const validations: Validation<MothlyEntryReportProps>[] = [
      new UUIDValidation('id'),

      new EnumValidation('month', Month, 'Month'),

      new UUIDValidation('account'),
    ];

    return new ValidationComposite(validations);
  }
}

export class MothlyEntryReportFactory {
  public static create(props: MothlyEntryReportProps): IMothlyEntryReport {
    return new MothlyEntryReport(
      props.id,
      props.month,
      props.account,
      props.summary,
    );
  }
}