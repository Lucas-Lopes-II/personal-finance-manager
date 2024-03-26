import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import request from 'supertest';
import { AppModule } from '../../../../../app.module';
import { E2EUtilities } from '@shared/test';
import { Month } from '@shared/domain/enums';
import { dataSource } from '@shared/infra/database';
import { MonthlyEntryReportE2EUtilities } from '@monthly-entry-report/test';
import { CreateMonthlyEntryReportDTO } from '@monthly-entry-report/infra/controllers/dtos';
import { globalExeptionFiltersFactory } from '@shared/infra/exception-filters';
import { FinanceAccountProps } from '@finance-accounts/domain/entities';

describe('MonthlyEntryReportController E2E tests', () => {
  let app: INestApplication;
  let server: any;
  let authToken: string;
  let financeAccount: FinanceAccountProps;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    globalExeptionFiltersFactory(app);
    await app.init();
    server = app.getHttpServer();

    try {
      await dataSource.initialize();
      const user = await E2EUtilities.createUser({
        name: 'test',
        email: 'test@test.com',
        password: 'Test@123',
      });
      authToken = await E2EUtilities.executeLoginAndReturnToken(
        request,
        server,
        { email: 'test@test.com', password: 'Test@123' },
      );
      financeAccount =
        await MonthlyEntryReportE2EUtilities.createFinanceAccount([
          user?.['id'],
        ]);
    } catch (error) {
      console.log(error);
    }
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  describe('create', () => {
    let mockedDTO: CreateMonthlyEntryReportDTO;

    beforeAll(() => {
      mockedDTO = {
        year: 2023,
        month: Month.JULY,
        accountId: financeAccount.id,
      };
    });

    it('should create a MonthlyEntryReport', async () => {
      const response = await request(server)
        .post('/monthly-entry-reports')
        .send(mockedDTO)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toStrictEqual(201);
    });

    it('should return a ForbiddenError if action do not done by account owner', async () => {
      const stubfinanceAccount =
        await MonthlyEntryReportE2EUtilities.createFinanceAccount();
      const response = await request(server)
        .post('/monthly-entry-reports')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...mockedDTO, accountId: stubfinanceAccount.id });

      expect(response.status).toStrictEqual(403);
    });

    it('should return Unauthorized Error', async () => {
      const response = await request(server)
        .post('/monthly-entry-reports')
        .send(mockedDTO);

      expect(response.status).toStrictEqual(401);
      expect(response.body).toStrictEqual({
        message: 'Unauthorized',
        statusCode: 401,
      });
    });

    it('should return BadRequest Error', async () => {
      let response = await request(server)
        .post('/monthly-entry-reports')
        .send({ ...mockedDTO, year: 1950 })
        .set('Authorization', `Bearer ${authToken}`);
      expect(response.status).toStrictEqual(400);
      expect(response.body.error).toStrictEqual('Bad Request');

      response = await request(server)
        .post('/monthly-entry-reports')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...mockedDTO, year: 3001 });
      expect(response.status).toStrictEqual(400);
      expect(response.body.error).toStrictEqual('Bad Request');

      response = await request(server)
        .post('/monthly-entry-reports')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...mockedDTO, month: 'wrong month' });
      expect(response.status).toStrictEqual(400);
      expect(response.body.error).toStrictEqual('Bad Request');

      response = await request(server)
        .post('/monthly-entry-reports')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...mockedDTO, accountId: 'any id' });
      expect(response.status).toStrictEqual(400);
      expect(response.body.error).toStrictEqual('Bad Request');
    });
  });
});
