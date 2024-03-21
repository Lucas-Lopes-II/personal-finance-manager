export interface FindUserByIdInput {
  id: string;
  selectedfields?: (keyof FindUserByIdOutput)[];
}
export interface FindUserByIdOutput {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}
