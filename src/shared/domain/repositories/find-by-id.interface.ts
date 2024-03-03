export interface IFindById<T> {
  findById(id: string, fields?: (keyof T)[]): Promise<T | Partial<T>>;
}
