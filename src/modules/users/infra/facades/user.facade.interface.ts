import {
  BecomeAdminInput,
  BecomeAdminOutput,
  FindUserByEmailInput,
  FindUserByEmailOutput,
  FindUserByIdInput,
  FindUserByIdOutput,
} from '@users/infra/facades';

export interface IUserFacade {
  findById(
    input: FindUserByIdInput,
  ): Promise<FindUserByIdOutput | Partial<FindUserByIdOutput>>;
  becomeAdmin(input: BecomeAdminInput): Promise<BecomeAdminOutput>;
  findByEmail(
    input: FindUserByEmailInput,
  ): Promise<FindUserByEmailOutput | Partial<FindUserByEmailOutput>>;
}
