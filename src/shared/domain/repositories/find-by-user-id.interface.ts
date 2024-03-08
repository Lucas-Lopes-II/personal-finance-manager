export interface IFindByUserId<T> {
  findByUserId(
    userId: string,
    fields?: (keyof T)[],
  ): Promise<T[] | Partial<T>[]>;
}
