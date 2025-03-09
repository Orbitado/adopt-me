import { hashSync, compareSync, genSaltSync } from "bcrypt";
import { ErrorDictionary } from "./error-dictionary";

const hashPassword = (password: string) => {
  try {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  } catch (error) {
    throw ErrorDictionary.internalServerError(
      "Failed to hash password",
      (error as Error).message,
    );
  }
};

const comparePassword = (password: string, hash: string) => {
  try {
    const result = compareSync(password, hash);
    return result;
  } catch (error) {
    throw ErrorDictionary.internalServerError(
      "Failed to compare password",
      (error as Error).message,
    );
  }
};

export { hashPassword, comparePassword };
