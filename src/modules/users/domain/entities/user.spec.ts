import { randomUUID } from 'node:crypto';
import { UserFactory } from '@users/domain/entities';
import { BadRequestError, ForbiddenError } from '@shared/domain/errors';

describe('User unit tests', () => {
  const id = randomUUID();
  const data = {
    id,
    name: 'Name',
    email: 'email@example.com',
    isAdmin: false,
    password: 'Test@123',
  };

  it('should create an user', () => {
    let user = UserFactory.create(data);

    expect(user.id).toStrictEqual(id);
    expect(user.name).toStrictEqual('Name');
    expect(user.email).toStrictEqual('email@example.com');
    expect(user.password).toStrictEqual('Test@123');
    expect(user.toJSON()).toStrictEqual({
      id,
      name: 'Name',
      email: 'email@example.com',
      isAdmin: false,
      password: 'Test@123',
    });

    user = UserFactory.create({ ...data, id: undefined, password: undefined });
    expect(user.password).toBeNull();
    expect(user.toJSON()).toStrictEqual({
      id: user.id,
      name: 'Name',
      email: 'email@example.com',
      isAdmin: false,
      password: null,
    });
  });

  describe('validation()', () => {
    it('should validate id correctly when create an user', () => {
      expect(() =>
        UserFactory.create({
          ...data,
          id: 'dsdsdsdff',
        }),
      ).toThrow(new BadRequestError('id in invalid format'));
    });

    it('should validate name correctly when create an user', () => {
      expect(() =>
        UserFactory.create({
          ...data,
          id: undefined,
          name: 'N',
        }),
      ).toThrow(new BadRequestError('name must contain at least 2 characters'));
      expect(() =>
        UserFactory.create({
          ...data,
          name: undefined,
        }),
      ).toThrow(new BadRequestError(`name is required`));
      expect(() =>
        UserFactory.create({
          ...data,
          name: 'it is too big'.repeat(10),
        }),
      ).toThrow(
        new BadRequestError(`name must contain a maximum of 100 characters`),
      );
      expect(() =>
        UserFactory.create({
          ...data,
          name: 10 as any,
        }),
      ).toThrow(new BadRequestError('name must be a string'));
    });

    it('should validate password correctly when create an user', () => {
      expect(() =>
        UserFactory.create({
          ...data,
          password: null,
        }),
      ).not.toThrow();
      expect(() =>
        UserFactory.create({
          ...data,
          password: 'test',
        }),
      ).toThrow(
        new BadRequestError('password must contain at least 6 characters'),
      );
    });
  });

  describe('becomeAdmin', () => {
    it('should become admin correctly', () => {
      const adminUser = UserFactory.create({
        ...data,
        isAdmin: true,
        password: 'inicial password',
      });
      const user = UserFactory.create({
        ...data,
        password: 'inicial password',
      });

      user.becomeAdmin(adminUser);
      expect(user.isAdmin).toBeTruthy();
    });

    it('should throw ForbiddenError if action is done by no admin user', () => {
      const adminUser = UserFactory.create({
        ...data,
        isAdmin: false,
        password: 'inicial password',
      });
      const user = UserFactory.create({
        ...data,
        password: 'inicial password',
      });

      expect(() => user.becomeAdmin(adminUser)).toThrow(
        new ForbiddenError('Action not allowed'),
      );
    });
  });

  describe('changePassword', () => {
    it('should change the password correctly', () => {
      const user = UserFactory.create({
        ...data,
        password: 'inicial password',
      });

      expect(user.password).toStrictEqual('inicial password');

      user.changePassword('new password');
      expect(user.password).toStrictEqual('new password');
      expect(user.toJSON()).toStrictEqual({
        id,
        name: 'Name',
        email: 'email@example.com',
        isAdmin: false,
        password: 'new password',
      });
    });

    it('should validate the password when it changes', () => {
      const user = UserFactory.create({
        ...data,
        password: 'inicial password',
      });

      expect(user.password).toStrictEqual('inicial password');

      expect(() => user.changePassword('new')).toThrow(
        new BadRequestError('password must contain at least 6 characters'),
      );
      expect(() => user.changePassword(10 as any)).toThrow(
        new BadRequestError('password must be a string'),
      );
      expect(() => user.changePassword('')).toThrow(
        new BadRequestError(`password is required`),
      );
      expect(() => user.changePassword(false as any)).toThrow(
        new BadRequestError(`password is required`),
      );
      expect(() => user.changePassword(undefined as any)).toThrow(
        new BadRequestError(`password is required`),
      );
      expect(() => user.changePassword(null as any)).toThrow(
        new BadRequestError(`password is required`),
      );
    });
  });

  describe('UserFactory', () => {
    it('should create an user with factory', () => {
      const user = UserFactory.create(data);

      expect(user.id).toStrictEqual(id);
      expect(user.name).toStrictEqual('Name');
      expect(user.email).toStrictEqual('email@example.com');
      expect(user.password).toStrictEqual('Test@123');
      expect(user.toJSON()).toStrictEqual({
        id,
        name: 'Name',
        email: 'email@example.com',
        isAdmin: false,
        password: 'Test@123',
      });
    });
  });
});
