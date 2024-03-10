import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import request from 'supertest';
import { randomUUID } from 'node:crypto';
import { AppModule } from './../../../../../app.module';
import { userRepositoryFactory } from '@users/infra/data/repositories';
import { UserProps } from '@users/domain/entities';
import { E2EUtilities } from '@shared/test';
import { dataSource } from '@shared/infra/database';
import { globalExeptionFiltersFactory } from '@shared/infra/exception-filters';

describe('AuthController E2E tests', () => {
  let app: INestApplication;
  let server: any;
  let authToken: string;
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

  describe('signup', () => {
    it('should sign-up an user', async () => {
      const response = await request(server)
        .post('/auth/sign-up')
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
        .post('/auth/sign-up')
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
      const response = await request(server).post('/auth/sign-up').send({
        name: 'test 3',
        email: 'tes3t@test.com',
        password: 'Test 3@123',
      });

      expect(response.status).toStrictEqual(401);
      expect(response.body.message).toStrictEqual('Unauthorized');
    });

    it('should throw Bad request error', async () => {
      let response = await request(server)
        .post('/auth/sign-up')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .send({
          name: 't',
          email: 'tes3t@test.com',
          password: 'Test 3@123',
        });

      expect(response.status).toStrictEqual(400);
      expect(response.body.error).toStrictEqual('Bad Request');

      response = await request(server)
        .post('/auth/sign-up')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .send({
          name: 1,
          email: 'tes3t@test.com',
          password: 'Test 3@123',
        });

      expect(response.status).toStrictEqual(400);
      expect(response.body.error).toStrictEqual('Bad Request');

      response = await request(server)
        .post('/auth/sign-up')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .send({
          name: 'Neme 3',
          email: 'tes3ttest.com',
          password: 'Test 3@123',
        });

      expect(response.status).toStrictEqual(400);
      expect(response.body.error).toStrictEqual('Bad Request');

      response = await request(server)
        .post('/auth/sign-up')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .send({
          name: 'Neme 3',
          email: 1,
          password: 'Test 3@123',
        });

      expect(response.status).toStrictEqual(400);
      expect(response.body.error).toStrictEqual('Bad Request');

      response = await request(server)
        .post('/auth/sign-up')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .send({
          name: 'Neme 3',
          email: 'tes3t@test.com',
          password: 'Te123',
        });

      expect(response.status).toStrictEqual(400);
      expect(response.body.error).toStrictEqual('Bad Request');

      response = await request(server)
        .post('/auth/sign-up')
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

  describe('login', () => {
    it('should sign-in an user', async () => {
      const response = await request(server).post('/auth/login').send({
        email: 'test@test.com',
        password: 'Test@123',
      });

      expect(response.status).toStrictEqual(200);
      expect(response.body.access_token).toBeDefined();
    });

    it('should throw Bad request error', async () => {
      let response = await request(server)
        .post('/auth/login')

        .send({
          email: 'testtest',
          password: 'Test@123',
        });
      expect(response.status).toStrictEqual(400);

      response = await request(server)
        .post('/auth/login')

        .send({
          email: 1,
          password: 'Test@123',
        });
      expect(response.status).toStrictEqual(400);

      response = await request(server)
        .post('/auth/login')

        .send({
          email: 'te',
          password: 'Test@123',
        });
      expect(response.status).toStrictEqual(400);

      response = await request(server).post('/auth/login').send({
        email: 'test@test.com',
        password: 'Test123',
      });
      expect(response.status).toStrictEqual(400);

      response = await request(server).post('/auth/login').send({
        email: 'test@test.com',
        password: 'T',
      });
      expect(response.status).toStrictEqual(400);
    });
  });

  describe('becomeAdminUser', () => {
    let user: UserProps;

    beforeAll(async () => {
      const repo = userRepositoryFactory();
      user = (await repo.findByEmail('test@test.com')) as UserProps;
    });

    it('should become admin user', async () => {
      const response = await request(server)
        .put('/auth/become-admin-user')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .send({
          userId: user.id,
        });

      expect(response.status).toStrictEqual(200);
      expect(response.body.name).toStrictEqual(user.name);
      expect(response.body.email).toStrictEqual(user.email);
      expect(response.body.id).toStrictEqual(user.id);
    });

    it('should throw Forbidden error if action done by no admin user', async () => {
      const response = await request(server)
        .put('/auth/become-admin-user')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: user.id,
        });

      expect(response.status).toStrictEqual(403);
      expect(response.body.message).toStrictEqual('Access denied');
    });

    it('should throw Unauthorized error if there is no auth token', async () => {
      const response = await request(server)
        .put('/auth/become-admin-user')
        .send({
          userId: user.id,
        });

      expect(response.status).toStrictEqual(401);
      expect(response.body.message).toStrictEqual('Unauthorized');
    });

    it('should throw Bad request error', async () => {
      const response = await request(server)
        .put('/auth/become-admin-user')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .send({
          userId: randomUUID(),
        });

      expect(response.status).toStrictEqual(400);
      expect(response.body.error).toStrictEqual('Bad Request');
    });
  });
});
