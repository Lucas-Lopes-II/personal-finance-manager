export interface IUpdate<ID = unknown, D = unknown, T = unknown> {
  update(id: ID, data: Partial<D>): Promise<T>;
}
