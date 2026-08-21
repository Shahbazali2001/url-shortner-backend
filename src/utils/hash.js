import { randomBytes, createHmac } from "crypto";

export function hashPasswordWithSalt(password) {
  const salt = randomBytes(16).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  return { hashedPassword, salt };
}
