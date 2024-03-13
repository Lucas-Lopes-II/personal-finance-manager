export interface FindByIdInput {
  id: string;
  selectedfields?: (keyof FindByIdOutput)[];
}
export interface FindByIdOutput {
  id?: string;
  name?: string;
  users: string[];
  date?: string;
}

export interface IFinanceAccountFacade {
  findById(
    input: FindByIdInput,
  ): Promise<FindByIdOutput | Partial<FindByIdOutput>>;
}
