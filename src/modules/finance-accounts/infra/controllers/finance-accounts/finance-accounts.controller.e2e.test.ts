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
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';

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

      expect(response.status).toStrictEqual(201);
    });

    it('should return Unauthorized Error', async () => {
      const response = await request(server)
        .post('/finance-accounts')
        .send(mockedInput);

      expect(response.status).toStrictEqual(401);
      expect(response.body).toStrictEqual({
        message: 'Unauthorized',
        statusCode: 401,
      });
    });

    it('should return BadRequest Error', async () => {
      let response = await request(server)
        .post('/finance-accounts')
        .send({ ...mockedInput, name: 1 })
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toStrictEqual(400);
      expect(response.body.error).toStrictEqual('Bad Request');

      response = await request(server)
        .post('/finance-accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...mockedInput, name: 't' });

      expect(response.status).toStrictEqual(400);
      expect(response.body.error).toStrictEqual('Bad Request');

      response = await request(server)
        .post('/finance-accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...mockedInput, date: 1 });

      expect(response.status).toStrictEqual(400);
      expect(response.body.error).toStrictEqual('Bad Request');
    });
  });

  describe('addUser', () => {
    let user;
    let financeAccountRepo: Repository<FinanceAccountEntity>;
    let accountsResponse;
    let accounts: FinanceAccountProps[];
    let mockedAthToken;

    beforeAll(async () => {
      financeAccountRepo = dataSource.getRepository(FinanceAccountEntity);
      user = await E2EUtilities.createUser({
        name: 'test 2',
        email: 'tes2t@test.com',
        password: 'Test2@123',
      });
      mockedAthToken = await E2EUtilities.executeLoginAndReturnToken(
        request,
        server,
        { email: 'tes2t@test.com', password: 'Test2@123' },
      );
    });

    it('should add an user in financeAccount', async () => {
      await request(server)
        .post('/finance-accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: `account 0`,
          date: new Date().toISOString(),
        });

      accountsResponse = await request(server)
        .get('/finance-accounts')
        .set('Authorization', `Bearer ${authToken}`);
      accounts = accountsResponse.body;

      const response = await request(server)
        .put('/finance-accounts/add-user')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          accountId: accounts[0].id,
          userId: user.id,
        });

      expect(response.status).toStrictEqual(200);
    });

    it('should return BadRequest Error if user is already added', async () => {
      await request(server)
        .post('/finance-accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: `account 0`,
          date: new Date().toISOString(),
        });

      accountsResponse = await request(server)
        .get('/finance-accounts')
        .set('Authorization', `Bearer ${authToken}`);
      accounts = accountsResponse.body;

      await request(server)
        .put('/finance-accounts/add-user')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          accountId: accounts[0].id,
          userId: user.id,
        });

      const response = await request(server)
        .put('/finance-accounts/add-user')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          accountId: accounts[0].id,
          userId: user.id,
        });

      expect(response.status).toStrictEqual(400);
      expect(response.body.message).toStrictEqual('this user is already added');
    });

    it('should return Forbidden Error if the user adding the new user does not belong to the account', async () => {
      financeAccountRepo.clear();
      await request(server)
        .post('/finance-accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: `account 0`,
          date: new Date().toISOString(),
        });

      accountsResponse = await request(server)
        .get('/finance-accounts')
        .set('Authorization', `Bearer ${authToken}`);
      accounts = accountsResponse.body;

      const response = await request(server)
        .put('/finance-accounts/add-user')
        .set('Authorization', `Bearer ${mockedAthToken}`)
        .send({
          accountId: accounts[0].id,
          userId: user.id,
        });

      expect(response.status).toStrictEqual(403);
      expect(response.body.message).toStrictEqual('Action not allowed');
    });

    it('should return Unauthorized Error', async () => {
      const response = await request(server)
        .put('/finance-accounts/add-user')
        .send({
          accountId: randomUUID(),
          userId: user.id,
        });

      expect(response.status).toStrictEqual(401);
      expect(response.body).toStrictEqual({
        message: 'Unauthorized',
        statusCode: 401,
      });
    });

    it('should return BadRequest Error', async () => {
      let response = await request(server)
        .put('/finance-accounts/add-user')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          accountId: 'wrong id',
          userId: user.id,
        });

      expect(response.status).toStrictEqual(400);
      expect(response.body.error).toStrictEqual('Bad Request');

      response = await request(server)
        .put('/finance-accounts/add-user')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          accountId: randomUUID(),
          userId: 'wrong id',
        });

      expect(response.status).toStrictEqual(400);
      expect(response.body.error).toStrictEqual('Bad Request');
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

    it('should find financeAccounts by user id', async () => {
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

    it('should find financeAccounts by user id with select fields', async () => {
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
