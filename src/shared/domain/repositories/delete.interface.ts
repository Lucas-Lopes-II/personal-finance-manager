export interface IDelete<ID = unknown> {
  delete(id: ID): Promise<void>;
}
