import { Validation } from '@shared/domain/validations';
import { BadRequestError } from '@shared/domain/errors';
import { Month } from '@shared/domain/enums';
import { EnumValidation } from '../../enum.validation';

describe('EnumValidation unit tests', () => {
  let sut: Validation;
  const dataValidate = {
    month: Month.AUGUST,
  };

  beforeEach(() => {
    sut = new EnumValidation('month', Month, 'Month');
  });

  it('should vailidate correctly', async () => {
    expect(() => sut.validate(dataValidate)).not.toThrow();
  });

  it('should throw a BadRequestError when the given month is not provided', async () => {
    dataValidate.month = null;
    expect(() => sut.validate(dataValidate)).toThrow(
      new BadRequestError(`month is required`),
    );
  });

  it('should not throw a BadRequestError when the given month is not provided and isRequired flag is false', async () => {
    sut = new EnumValidation('month', Month, null, false);
    dataValidate.month = null;

    expect(() => sut.validate(dataValidate)).not.toThrow();
  });

  it('should throw a BadRequestError when the given month is not a number', async () => {
    dataValidate.month = 15 as any;

    expect(() => sut.validate(dataValidate)).toThrow(
      new BadRequestError(`month should be type enum Month`),
    );

    sut = new EnumValidation('month', Month, null);
    expect(() => sut.validate(dataValidate)).toThrow(
      new BadRequestError(`month should be type enum`),
    );
  });
});
