export interface BecomeAdminInput {
  actionDoneBy: string;
  userId: string;
}
export interface BecomeAdminOutput {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}
