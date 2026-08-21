import express from "express";
import { eq } from "drizzle-orm";

// Utils
import { hashPasswordWithSalt } from "./../utils/hash.js";

// Request Validation
import { signUpRequestSchema } from "./../validation/request.validation.js";

// User Service
import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
} from "./../services/user.service.js";

export const userRouter = express.Router();

// Handle user signup
userRouter.post("/signup", async (req, res) => {
  try {
    // Validate request body
    const validationResult = await signUpRequestSchema.parseAsync(req.body);
    const { firstname, lastname, email, password } = validationResult;

    // Check existing user
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res
        .status(400)
        .json({ error: `User with email ${email} already exists` });
    }

    // Hash password with salt

    const { hashedPassword, salt } = hashPasswordWithSalt(password);

    // Create new user with both hash and salt stored
    const newUser = await createUser(
      firstname,
      lastname,
      email,
      hashedPassword,
      salt,
    );
    res.status(201).json({ data: { userId: newUser.id } });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Invalid request",
    });
  }
});
