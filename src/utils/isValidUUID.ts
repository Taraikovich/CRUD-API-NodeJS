import { UUID_REGEX } from "../constants/constants";

const isValidUUID = (id: string): boolean => {
  return UUID_REGEX.test(id);
};

export default isValidUUID;
