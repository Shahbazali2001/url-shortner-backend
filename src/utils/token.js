import jwt from "jsonwebtoken";
import { userTokenSchema } from "../validation/token.validation.js";

export async function createUserToken(payload) {
  const tokenValidationResult = await userTokenSchema.safeParseAsync(payload);
  if (tokenValidationResult.error)
    throw new Error(tokenValidationResult.error.message);

  const validatedPayload = tokenValidationResult.data;

  const token = jwt.sign(validatedPayload, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });
  return token;
}

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

export function decodeToken(token) {
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    return null;
  }
}
