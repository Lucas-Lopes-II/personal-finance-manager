import {
  BecomeAdminInput,
  BecomeAdminOutput,
  FindUserByIdInput,
  FindUserByIdOutput,
} from '@users/infra/facades';

export interface IUserFacade {
  findById(
    input: FindUserByIdInput,
  ): Promise<FindUserByIdOutput | Partial<FindUserByIdOutput>>;
  becomeAdmin(input: BecomeAdminInput): Promise<BecomeAdminOutput>;
}
