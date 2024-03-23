export interface ICreate<D = unknown, T = unknown> {
  create(data: D): Promise<T>;
}
