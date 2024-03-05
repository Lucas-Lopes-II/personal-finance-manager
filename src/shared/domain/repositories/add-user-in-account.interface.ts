export interface IAddUserInAccount<D = unknown, T = unknown> {
  addUserInAccount(data: D): Promise<T>;
}
