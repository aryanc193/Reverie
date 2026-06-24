import { Schema, model, Document, Types } from "mongoose";

export type ConversationRole = "user" | "assistant";

export interface IConversationMessage {
  role: ConversationRole;
  content: string;
  createdAt: Date;
}

export interface IConversationMetadata {
  relatedMemoryIds?: Types.ObjectId[];
  insightIds?: Types.ObjectId[];
}

export interface IConversation extends Document {
  userId: Types.ObjectId;
  title?: string;
  messages: IConversationMessage[];
  metadata?: IConversationMetadata;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationMessageSchema = new Schema<IConversationMessage>(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { _id: false },
);

const ConversationSchema = new Schema<IConversation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
    },
    messages: {
      type: [ConversationMessageSchema],
      default: [],
    },
    metadata: {
      relatedMemoryIds: [{ type: Schema.Types.ObjectId }],
      insightIds: [{ type: Schema.Types.ObjectId }],
    },
  },
  { timestamps: true },
);

ConversationSchema.index({ userId: 1, updatedAt: -1 });

export const Conversation = model<IConversation>(
  "Conversation",
  ConversationSchema,
);
