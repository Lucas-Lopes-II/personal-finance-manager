import { randomUUID } from 'node:crypto';
import {
  MothlyEntryReportFactory,
  MothlyEntryReportProps,
} from './monthly-entry-report';

describe('MothlyEntryReport unit tests', () => {
  const data: MothlyEntryReportProps = {
    id: randomUUID(),
    account: randomUUID(),
    month: '',
    summary: [],
  };

  it('should create a Mothly Entry Report correctly', () => {
    const mothlyEntryReport = MothlyEntryReportFactory.create(data);
    const result = mothlyEntryReport.toJSON();

    expect(mothlyEntryReport.id).toStrictEqual(data.id);
    expect(mothlyEntryReport.month).toStrictEqual('');
    expect(mothlyEntryReport.summary).toStrictEqual([]);
    expect(mothlyEntryReport.account).toStrictEqual(data.account);
    expect(result).toStrictEqual({
      id: data.id,
      account: data.account,
      month: data.month,
      summary: data.summary,
    });
  });
});
