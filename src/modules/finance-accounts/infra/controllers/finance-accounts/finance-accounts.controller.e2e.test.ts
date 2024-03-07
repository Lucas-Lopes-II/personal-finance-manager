import { AppModule } from '../../../../../app.module';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CreateFinanceAccountDTO } from '../dtos';
import { dataSource } from '@shared/infra/database';
import { E2EUtilities } from '@shared/test';
import { globalExeptionFiltersFactory } from '@shared/infra/exception-filters';

describe('FinanceAccountsController E2E tests', () => {
  let app: INestApplication;
  let server: any;
  let authToken: string;

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
      await E2EUtilities.createUser({
        name: 'test',
        email: 'test@test.com',
        password: 'Test@123',
      });
      authToken = await E2EUtilities.executeLoginAndReturnToken(
        request,
        server,
        { email: 'test@test.com', password: 'Test@123' },
      );
    } catch (error) {
      console.log(error);
    }
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  describe('create', () => {
    const mockedInput: CreateFinanceAccountDTO = {
      name: 'test',
      date: new Date().toISOString(),
    };

    it('should create a financeAccount', async () => {
      const response = await request(server)
        .post('/finance-accounts')
        .send(mockedInput)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toEqual(201);
    });

    it('should return Unauthorized Error', async () => {
      const response = await request(server)
        .post('/finance-accounts')
        .send(mockedInput);

      expect(response.status).toEqual(401);
      expect(response.body).toEqual({
        message: 'Unauthorized',
        statusCode: 401,
      });
    });

    it('should return BadRequest Error', async () => {
      let response = await request(server)
        .post('/finance-accounts')
        .send({ ...mockedInput, name: 1 })
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toEqual(400);
      expect(response.body.error).toEqual('Bad Request');

      response = await request(server)
        .post('/finance-accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...mockedInput, name: 't' });

      expect(response.status).toEqual(400);
      expect(response.body.error).toEqual('Bad Request');

      response = await request(server)
        .post('/finance-accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...mockedInput, date: 1 });

      expect(response.status).toEqual(400);
      expect(response.body.error).toEqual('Bad Request');
    });
  });
});
