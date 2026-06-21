import bcrypt from "bcryptjs";
import { User } from "../auth/auth.model";
import { signToken } from "../auth/jwt";
import { AppError } from "../utils/api-error";
import { LoginInput, RegisterInput } from "../validators/auth.validator";

const SALT_ROUNDS = 12;

export async function registerUser(input: RegisterInput) {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw new AppError(409, "Email already in use");
  }

  const existingUsername = await User.findOne({ username: input.username });
  if (existingUsername) {
    throw new AppError(409, "Username already in use");
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await User.create({
    username: input.username,
    email: input.email,
    passwordHash,
  });

  const token = signToken({ userId: user._id.toString() });
  return { token };
}

export async function loginUser(input: LoginInput) {
  const user = await User.findOne({ username: input.username });
  if (!user) {
    throw new AppError(401, "Invalid credentials");
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw new AppError(401, "Invalid credentials");
  }

  const token = signToken({ userId: user._id.toString() });
  return { token };
}
