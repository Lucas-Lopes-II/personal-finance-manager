export interface IEmailExists {
  emailExists(email: string): Promise<boolean>;
}
