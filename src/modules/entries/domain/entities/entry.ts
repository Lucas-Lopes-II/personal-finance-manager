import { EntryType } from '@entries/domain/enums';
import { randomUUID } from 'node:crypto';
import {
  UUIDValidation,
  Validation,
  ValidationComposite,
  EnumValidation,
  MinValueFieldValidation,
  MinLengthFieldValidation,
  ISODateValidation,
  MaxLengthFieldValidation,
} from '@shared/domain/validations';
import { BadRequestError } from '@shared/domain/errors';

export type EntryProps = {
  id?: string;
  description: string;
  type: EntryType;
  executionDate: string;
  value: number;
  monthlyEntryReport: string;
};

export interface IEntry {
  get id(): string;
  get description(): string;
  get type(): EntryType;
  get executionDate(): string;
  get value(): number;
  get monthlyEntryReport(): string;
  toJSON(): EntryProps;
}

class Entry implements IEntry {
  private _id: string;
  private _description: string;
  private _type: EntryType;
  private _executionDate: string;
  private _value: number;
  private _monthlyEntryReport: string;

  constructor(
    id: string,
    description: string,
    type: EntryType,
    executionDate: string,
    value: number,
    monthlyEntryReport: string,
  ) {
    this._id = id || randomUUID();
    this._description = description;
    this._type = type;
    this._executionDate = executionDate;
    this._value = value;
    this._monthlyEntryReport = monthlyEntryReport;
    this.validation();
  }

  get id(): string {
    return this._id;
  }

  get description(): string {
    return this._description;
  }

  get type(): EntryType {
    return this._type;
  }

  get executionDate(): string {
    return this._executionDate;
  }

  get value(): number {
    return this._value;
  }

  get monthlyEntryReport(): string {
    return this._monthlyEntryReport;
  }

  public toJSON(): EntryProps {
    return {
      id: this._id,
      description: this._description,
      type: this._type,
      executionDate: this._executionDate,
      value: this._value,
      monthlyEntryReport: this._monthlyEntryReport,
    };
  }

  private validation(): void {
    if (this._value <= 0) {
      throw new BadRequestError(
        'The value cannot be less than or equal to zero',
      );
    }
    const validator = this.createValidator();
    validator.validate(this.toJSON());
  }

  private createValidator(): Validation {
    const validations: Validation<EntryProps>[] = [
      new UUIDValidation('id'),

      new MinLengthFieldValidation('description', 2),
      new MaxLengthFieldValidation('description', 100),

      new EnumValidation('type', EntryType, 'EntryType'),

      new ISODateValidation('executionDate'),

      new MinValueFieldValidation('value', 0),

      new UUIDValidation('monthlyEntryReport'),
    ];

    return new ValidationComposite(validations);
  }
}

export class EntryFactory {
  public static create(props: EntryProps): IEntry {
    return new Entry(
      props.id,
      props.description,
      props.type,
      props.executionDate,
      props.value,
      props.monthlyEntryReport,
    );
  }
}
