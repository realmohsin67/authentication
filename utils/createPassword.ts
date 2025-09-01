import bcrypt from "bcryptjs";

export function createPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}
