import { randomUUID } from 'node:crypto';
import {
  MonthlyEntryReportFactory,
  MonthlyEntryReportProps,
} from './monthly-entry-report';
import { BadRequestError } from '@shared/domain/errors';
import { Month } from '@shared/domain/enums';

describe('MonthlyEntryReport unit tests', () => {
  const data: MonthlyEntryReportProps = {
    id: randomUUID(),
    account: randomUUID(),
    month: Month.JANUARY,
    year: 2023,
    summary: [],
  };

  it('should create a Mothly Entry Report correctly', () => {
    const monthlyEntryReport = MonthlyEntryReportFactory.create(data);
    const result = monthlyEntryReport.toJSON();

    expect(monthlyEntryReport.id).toStrictEqual(data.id);
    expect(monthlyEntryReport.month).toStrictEqual(Month.JANUARY);
    expect(monthlyEntryReport.summary).toStrictEqual([]);
    expect(monthlyEntryReport.account).toStrictEqual(data.account);
    expect(monthlyEntryReport.year).toStrictEqual(data.year);
    expect(result).toStrictEqual({
      id: data.id,
      account: data.account,
      month: data.month,
      year: data.year,
      summary: data.summary,
    });
  });

  describe('validation', () => {
    it('should throw a BadRequestError if id is invalid', () => {
      const testData = { ...data, id: 'dfcdcfd' };

      expect(() => MonthlyEntryReportFactory.create(testData)).toThrow(
        new BadRequestError('id in invalid format'),
      );
    });

    it('should throw a BadRequestError if account is invalid', () => {
      const testData = { ...data, id: null, account: 'dfcdcfd' };

      expect(() => MonthlyEntryReportFactory.create(testData)).toThrow(
        new BadRequestError('account in invalid format'),
      );
    });

    it('should throw a BadRequestError if month is in incorrect value', () => {
      let testData = { ...data, month: 0 };

      expect(() => MonthlyEntryReportFactory.create(testData)).toThrow(
        new BadRequestError('month is required'),
      );

      testData = { ...data, month: -1 };

      expect(() => MonthlyEntryReportFactory.create(testData)).toThrow(
        new BadRequestError('month should be type enum Month'),
      );

      testData = { ...data, month: 13 };

      expect(() => MonthlyEntryReportFactory.create(testData)).toThrow(
        new BadRequestError('month should be type enum Month'),
      );
    });

    it('should throw a BadRequestError if year is invalid', () => {
      let testData = { ...data, year: null };

      expect(() => MonthlyEntryReportFactory.create(testData)).toThrow(
        new BadRequestError('year is required'),
      );

      testData = { ...data, year: '1999' };

      expect(() => MonthlyEntryReportFactory.create(testData)).toThrow(
        new BadRequestError('year must be a number'),
      );

      testData = { ...data, year: 1980 };

      expect(() => MonthlyEntryReportFactory.create(testData)).toThrow(
        new BadRequestError('year must be at least 1990'),
      );

      testData = { ...data, year: 3001 };

      expect(() => MonthlyEntryReportFactory.create(testData)).toThrow(
        new BadRequestError('year must be at most 3000'),
      );
    });
  });
});
