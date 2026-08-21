import db from "../config/db/index.js";
import { eq } from "drizzle-orm";
import { usersTable } from "../models/user.model.js";

// Get User by Id
export async function getUserById(userId) {
  const [user] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  return user;
}

// Get User by Email
export async function getUserByEmail(email) {
  const [existingUser] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, email));
  return existingUser;
}

// Get All Users
export async function getAllUsers() {
  const users = await db.select().from(usersTable);
  return users;
}

// Update User
export async function updateUser(userId, data) {
  const [user] = await db
    .update(usersTable)
    .set(data)
    .where(eq(usersTable.id, userId))
    .returning({ id: usersTable.id });
  return user;
}

// Delete User
export async function deleteUser(userId) {
  const [user] = await db
    .delete(usersTable)
    .where(eq(usersTable.id, userId))
    .returning({ id: usersTable.id });
  return user;
}

// Create User
export async function createUser(
  firstname,
  lastname,
  email,
  hashedPassword,
  salt,
) {
  const [newUser] = await db
    .insert(usersTable)
    .values({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      salt,
    })
    .returning({ id: usersTable.id });
  return newUser;
}
