import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { dataSource } from '@shared/infra/database';
import { AppModule } from './../../../../../app.module';
import { E2EUtilities } from '@shared/test';
import { globalExeptionFiltersFactory } from '@shared/infra/exception-filters';
import { FindUserById } from '@users/application/usecases';

describe('UsersController E2E tests', () => {
  let app: INestApplication;
  let server: any;
  let authToken: string;
  let user: FindUserById.Output;

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
    } catch (error) {
      console.log(error);
    }
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
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
