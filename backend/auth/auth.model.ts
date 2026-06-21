import { Schema, model, Document } from "mongoose";

export type UserRole = "user" | "admin";

export interface IRefreshTokenEntry {
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface IUser extends Document {
  email: string;
  username: string;
  profile?: {
    data: Buffer;
    contentType: string;
  };
  passwordHash: string;
  role: UserRole;
  isVerified: boolean;
  refreshTokens: IRefreshTokenEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshTokenEntry>(
  {
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
  },
  { _id: false },
);

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    profile: {
      data: {
        type: Buffer,
        required: false,
      },
      contentType: {
        type: String,
        required: false,
      },
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshTokens: {
      type: [RefreshTokenSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const User = model<IUser>("User", UserSchema);
