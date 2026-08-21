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
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export function decodeToken(token) {
  try {
    const decodedToken = jwt.decode(token);
    return decodedToken;
  } catch (error) {
    return null;
  }
}
