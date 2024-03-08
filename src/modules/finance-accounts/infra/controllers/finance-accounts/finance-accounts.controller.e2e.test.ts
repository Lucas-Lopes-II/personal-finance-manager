import { AppModule } from '../../../../../app.module';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CreateFinanceAccountDTO } from '../dtos';
import { dataSource } from '@shared/infra/database';
import { E2EUtilities } from '@shared/test';
import { globalExeptionFiltersFactory } from '@shared/infra/exception-filters';
import { FinanceAccountProps } from '@finance-accounts/domain/entities';
import { JwtFactory } from '@shared/infra/jwt';
import { FinanceAccountEntity } from '@finance-accounts/infra/data/entities';

describe('FinanceAccountsController E2E tests', () => {
  let app: INestApplication;
  let server: any;
  let authToken: string;

  const jwt = JwtFactory.create();

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

  describe('findByUserId', () => {
    beforeAll(async () => {
      const financeAccountRepo = dataSource.getRepository(FinanceAccountEntity);
      financeAccountRepo.clear();
      for (let i = 0; i < 2; i++) {
        await request(server)
          .post('/finance-accounts')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: `account ${i}`,
            date: new Date().toISOString(),
          });
      }
    });

    it('should create a financeAccount', async () => {
      const response = await request(server)
        .get('/finance-accounts')
        .set('Authorization', `Bearer ${authToken}`);

      const user = jwt.decode(authToken);
      const { body } = response;
      const sameUser = body.every((account: FinanceAccountProps) => {
        return account.users[0] === user?.['sub'];
      });

      expect(response.status).toStrictEqual(200);
      expect(body.length).toStrictEqual(2);
      expect(sameUser).toBeTruthy();
    });

    it('should create a financeAccount', async () => {
      const response = await request(server)
        .get('/finance-accounts?selectFields=id,name')
        .set('Authorization', `Bearer ${authToken}`);

      const { body } = response;

      expect(response.status).toStrictEqual(200);
      expect(body[0].id).toBeDefined();
      expect(body[0].name).toStrictEqual('account 0');
      expect(body[0].date).toBeUndefined();
    });
  });
});
