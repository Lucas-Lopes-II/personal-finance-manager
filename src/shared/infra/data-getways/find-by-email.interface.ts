export interface IFindByEmail<T> {
  findByEmail(email: string, fields?: (keyof T)[]): Promise<T | Partial<T>>;
}
