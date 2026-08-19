import { express } from "express";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { randomBytes, createHmac  } from "crypto";

// Database Import
import db from "./../config/db/index.js";

// Model Import
import { usersTable } from "./../models/index.js";


//Request Validation
import { signUpRequestSchema } from "./../validation/request.validation.js";


const router = express.Router();

router.post("/signup", (req, res) => {
  const validationResult = await signUpRequestSchema.parseAsync(req.body);

  if(validationResult.error){
    return res.status(400).json({ error: validationResult.error.message });
  }

  const { firstname, lastname, email, password } = validationResult.data;


  // check existing user
  const [existingUser] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, email));


  if (existingUser) {
    return res.status(400).json({ error: `User with email ${email} already exists` });
  }

  // hash password for new user
  const salt = randomBytes(256).toString("hex");
  const hashedPassword = createHmac("sha256", salt).update(password).digest("hex");

  // create new user
  const [newUser] = await db
    .insert(usersTable)
    .values({ firstname, lastname, email, password: hashedPassword, salt })
    .returning({ id: usersTable.id });

  res.status(201).json({ data :{userId: newUser.id} });
});

export default router;
