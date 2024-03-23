export interface IFind<ID = unknown, T = unknown> {
  find(id: ID): Promise<T>;
}
