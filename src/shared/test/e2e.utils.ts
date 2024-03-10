import { UserUseCasesFactory } from '@users/application/usecases';
import { userRepositoryFactory } from '@users/infra/data/repositories';
import supertest from 'supertest';

export class E2EUtilities {
  public static async createUser(body: {
    name: string;
    email: string;
    password: string;
  }): Promise<any> {
    const useCase = UserUseCasesFactory.createUser();
    return useCase.execute(body);
  }

  public static async executeLoginAndReturnToken(
    request: supertest.SuperTestStatic,
    server: any,
    body?: { email: string; password: string },
  ): Promise<string> {
    const loginResponse = await request(server)
      .post('/auth/login')
      .send({
        email: body.email || 'teste@test.com',
        password: body.password || 'Test@123',
      });
    const authToken = loginResponse.body.access_token;

    return authToken;
  }

  public static async executeLoginAndReturnAdminToken(
    request: supertest.SuperTestStatic,
    server: any,
  ): Promise<string> {
    const user = await this.createUser({
      name: 'admin',
      email: 'admin@test.com',
      password: 'Test@123',
    });
    const repo = userRepositoryFactory();
    await repo.update(user?.['id'], { isAdmin: true });

    const loginResponse = await request(server).post('/auth/login').send({
      email: 'admin@test.com',
      password: 'Test@123',
    });
    const authToken = loginResponse.body.access_token;

    return authToken;
  }
}
