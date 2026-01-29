import crypto from "crypto";

export const getRandomBytes = () => {
  return crypto.randomBytes(16).toString("hex");
};
