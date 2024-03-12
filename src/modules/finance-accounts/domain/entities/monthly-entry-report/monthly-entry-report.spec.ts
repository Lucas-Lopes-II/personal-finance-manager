import { randomUUID } from 'node:crypto';
import {
  MothlyEntryReportFactory,
  MothlyEntryReportProps,
} from './monthly-entry-report';
import { BadRequestError } from '@shared/domain/errors';
import { Month } from '@shared/domain/enums';

describe('MothlyEntryReport unit tests', () => {
  const data: MothlyEntryReportProps = {
    id: randomUUID(),
    account: randomUUID(),
    month: Month.JANUARY,
    summary: [],
  };

  it('should create a Mothly Entry Report correctly', () => {
    const mothlyEntryReport = MothlyEntryReportFactory.create(data);
    const result = mothlyEntryReport.toJSON();

    expect(mothlyEntryReport.id).toStrictEqual(data.id);
    expect(mothlyEntryReport.month).toStrictEqual(Month.JANUARY);
    expect(mothlyEntryReport.summary).toStrictEqual([]);
    expect(mothlyEntryReport.account).toStrictEqual(data.account);
    expect(result).toStrictEqual({
      id: data.id,
      account: data.account,
      month: data.month,
      summary: data.summary,
    });
  });

  describe('validation', () => {
    it('should throw a BadRequestError if id is invalid', () => {
      const testData = { ...data, id: 'dfcdcfd' };

      expect(() => MothlyEntryReportFactory.create(testData)).toThrow(
        new BadRequestError('id in invalid format'),
      );
    });

    it('should throw a BadRequestError if account is invalid', () => {
      const testData = { ...data, id: null, account: 'dfcdcfd' };

      expect(() => MothlyEntryReportFactory.create(testData)).toThrow(
        new BadRequestError('account in invalid format'),
      );
    });

    it('should throw a BadRequestError if month is in incorrect value', () => {
      let testData = { ...data, month: -1 };

      expect(() => MothlyEntryReportFactory.create(testData)).toThrow(
        new BadRequestError('month must be at least 1'),
      );

      testData = { ...data, month: 13 };

      expect(() => MothlyEntryReportFactory.create(testData)).toThrow(
        new BadRequestError('month must be at most 12'),
      );
    });
  });
});
