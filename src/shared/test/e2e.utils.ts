import { UserUseCasesFactory } from '@users/application/usecases';
import supertest from 'supertest';

export class E2EUtilities {
  public static async createUser(body: {
    name: string;
    email: string;
    password: string;
  }): Promise<void> {
    const useCase = UserUseCasesFactory.createUser();
    await useCase.execute(body);
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
}
