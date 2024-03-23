import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import request from 'supertest';
import { AppModule } from './../../../../../app.module';
import { E2EUtilities } from '@shared/test';
import { dataSource } from '@shared/infra/database';
import { globalExeptionFiltersFactory } from '@shared/infra/exception-filters';
import { FindUserById } from '@users/application/usecases';

describe('UsersController E2E tests', () => {
  let app: INestApplication;
  let server: any;
  let authToken: string;
  let user: FindUserById.Output;
  let adminAuthToken: string;

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
      user = await E2EUtilities.createUser({
        name: 'test',
        email: 'test@test.com',
        password: 'Test@123',
      });
      authToken = await E2EUtilities.executeLoginAndReturnToken(
        request,
        server,
        { email: 'test@test.com', password: 'Test@123' },
      );
      adminAuthToken = await E2EUtilities.executeLoginAndReturnAdminToken(
        request,
        server,
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
    it('should sign-up an user', async () => {
      const response = await request(server)
        .post('/users')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .send({
          name: 'test 2',
          email: 'tes2t@test.com',
          password: 'Test2@123',
        });

      expect(response.status).toStrictEqual(201);
      expect(response.body.name).toStrictEqual('test 2');
      expect(response.body.email).toStrictEqual('tes2t@test.com');
    });

    it('should throw Forbidden error if action done by no admin user', async () => {
      const response = await request(server)
        .post('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'test 3',
          email: 'tes3t@test.com',
          password: 'Test 3@123',
        });

      expect(response.status).toStrictEqual(403);
      expect(response.body.message).toStrictEqual('Access denied');
    });

    it('should throw Unauthorized error if there is no auth token', async () => {
      const response = await request(server).post('/users').send({
        name: 'test 3',
        email: 'tes3t@test.com',
        password: 'Test 3@123',
      });

      expect(response.status).toStrictEqual(401);
      expect(response.body.message).toStrictEqual('Unauthorized');
    });

    it('should throw Bad request error', async () => {
      let response = await request(server)
        .post('/users')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .send({
          name: 't',
          email: 'tes3t@test.com',
          password: 'Test 3@123',
        });

      expect(response.status).toStrictEqual(400);
      expect(response.body.error).toStrictEqual('Bad Request');

      response = await request(server)
        .post('/users')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .send({
          name: 1,
          email: 'tes3t@test.com',
          password: 'Test 3@123',
        });

      expect(response.status).toStrictEqual(400);
      expect(response.body.error).toStrictEqual('Bad Request');

      response = await request(server)
        .post('/users')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .send({
          name: 'Neme 3',
          email: 'tes3ttest.com',
          password: 'Test 3@123',
        });

      expect(response.status).toStrictEqual(400);
      expect(response.body.error).toStrictEqual('Bad Request');

      response = await request(server)
        .post('/users')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .send({
          name: 'Neme 3',
          email: 1,
          password: 'Test 3@123',
        });

      expect(response.status).toStrictEqual(400);
      expect(response.body.error).toStrictEqual('Bad Request');

      response = await request(server)
        .post('/users')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .send({
          name: 'Neme 3',
          email: 'tes3t@test.com',
          password: 'Te123',
        });

      expect(response.status).toStrictEqual(400);
      expect(response.body.error).toStrictEqual('Bad Request');

      response = await request(server)
        .post('/users')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .send({
          name: 'Neme 3',
          email: 'tes3t@test.com',
          password: 1,
        });

      expect(response.status).toStrictEqual(400);
      expect(response.body.error).toStrictEqual('Bad Request');
    });
  });

  describe('findById', () => {
    it('should find user by user id', async () => {
      const response = await request(server)
        .get(`/users/${user.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toStrictEqual(200);
      expect(response.body).toStrictEqual({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      } as FindUserById.Output);
    });

    it('should find user by user id with select fields', async () => {
      let response = await request(server)
        .get(`/users/${user.id}?selectFields=id,name`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toStrictEqual(200);
      expect(response.body).toStrictEqual({
        id: user.id,
        name: user.name,
      } as FindUserById.Output);

      response = await request(server)
        .get(`/users/${user.id}?selectFields=wrong,query,params`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toStrictEqual(200);
      expect(response.body).toStrictEqual({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      } as FindUserById.Output);
    });

    it('should return Unauthorized Error', async () => {
      const response = await request(server).get(`/users/${user.id}`);

      expect(response.status).toStrictEqual(401);
      expect(response.body).toStrictEqual({
        message: 'Unauthorized',
        statusCode: 401,
      });
    });

    it('should return BadRequest Error', async () => {
      const response = await request(server)
        .get(`/users/${'wrong id'}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toStrictEqual(400);
      expect(response.body.error).toStrictEqual('Bad Request');
    });
  });
});
