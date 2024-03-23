export interface IUpdate<D, T> {
  update(id: string, data: Partial<D>): Promise<T>;
}
