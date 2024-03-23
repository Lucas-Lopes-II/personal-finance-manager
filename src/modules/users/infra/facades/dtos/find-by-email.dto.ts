export interface FindUserByEmailInput {
  email: string;
  selectedfields?: (keyof FindUserByEmailOutput)[];
}
export interface FindUserByEmailOutput {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}
