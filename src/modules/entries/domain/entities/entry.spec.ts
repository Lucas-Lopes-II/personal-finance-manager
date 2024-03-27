import { randomUUID } from 'node:crypto';
import { EntryType } from '@entries/domain/enums';
import { EntryFactory, EntryProps } from '@entries/domain/entities';
import { BadRequestError } from '@shared/domain/errors';

describe('Entry unit tests', () => {
  const data: EntryProps = {
    id: randomUUID(),
    description: 'test desc',
    monthlyEntryReport: randomUUID(),
    executionDate: new Date().toISOString(),
    type: EntryType.REVENUES,
    value: 150.16,
  };

  it('should create an Entry correctly', () => {
    const Entry = EntryFactory.create(data);
    const result = Entry.toJSON();

    expect(Entry.id).toStrictEqual(data.id);
    expect(Entry.description).toStrictEqual(data.description);
    expect(Entry.executionDate).toStrictEqual(data.executionDate);
    expect(Entry.executionDate).toStrictEqual(data.executionDate);
    expect(Entry.type).toStrictEqual(data.type);
    expect(Entry.value).toStrictEqual(data.value);
    expect(Entry.monthlyEntryReport).toStrictEqual(data.monthlyEntryReport);
    expect(result).toStrictEqual({
      id: data.id,
      description: data.description,
      executionDate: data.executionDate,
      type: data.type,
      value: data.value,
      monthlyEntryReport: data.monthlyEntryReport,
    } as EntryProps);
  });

  describe('validation', () => {
    it('should throw a BadRequestError if id is invalid', () => {
      const testData = { ...data, id: 'dfcdcfd' };

      expect(() => EntryFactory.create(testData)).toThrow(
        new BadRequestError('id in invalid format'),
      );
    });

    it('should throw a BadRequestError if monthlyEntryReport is invalid', () => {
      const testData = { ...data, id: null, monthlyEntryReport: 'dfcdcfd' };

      expect(() => EntryFactory.create(testData)).toThrow(
        new BadRequestError('monthlyEntryReport in invalid format'),
      );
    });

    it('should throw a BadRequestError if type is in incorrect value', () => {
      let testData = { ...data, type: null };

      expect(() => EntryFactory.create(testData)).toThrow(
        new BadRequestError('type is required'),
      );

      testData = { ...data, type: 'wrong' };

      expect(() => EntryFactory.create(testData)).toThrow(
        new BadRequestError('type should be type enum EntryType'),
      );
    });

    it('should throw a BadRequestError if description is in incorrect value', () => {
      let testData = { ...data, description: 'i' };

      expect(() => EntryFactory.create(testData)).toThrow(
        new BadRequestError('description must contain at least 2 characters'),
      );

      testData = { ...data, description: null };
      expect(() => EntryFactory.create(testData)).toThrow(
        new BadRequestError(`description is required`),
      );

      testData = { ...data, description: 'it is too big'.repeat(10) };
      expect(() => EntryFactory.create(testData)).toThrow(
        new BadRequestError(
          `description must contain a maximum of 100 characters`,
        ),
      );

      testData = { ...data, description: 1 as any };
      expect(() => EntryFactory.create(testData)).toThrow(
        new BadRequestError('description must be a string'),
      );
    });

    it('should throw a BadRequestError if value is invalid', () => {
      let testData = { ...data, value: null };

      expect(() => EntryFactory.create(testData)).toThrow(
        new BadRequestError('The value cannot be less than or equal to zero'),
      );

      testData = { ...data, value: '1999' };

      expect(() => EntryFactory.create(testData)).toThrow(
        new BadRequestError('value must be a number'),
      );

      testData = { ...data, value: 0 };

      expect(() => EntryFactory.create(testData)).toThrow(
        new BadRequestError('The value cannot be less than or equal to zero'),
      );
    });

    it('should throw a BadRequestError if executionDate is invalid', () => {
      const testData = { ...data, executionDate: 'dfcdcfd' };

      expect(() => EntryFactory.create(testData)).toThrow(
        new BadRequestError('executionDate in invalid format'),
      );
    });
  });
});
