import { Schema, model, Document, Types } from "mongoose";

export type MemoryMood = "great" | "good" | "neutral" | "low" | "bad";

export interface IMemory extends Document {
  userId: Types.ObjectId;

  title?: string;
  richTextContent: string;
  mood?: MemoryMood;
  tags: string[];

  createdAt: Date;
  updatedAt: Date;

  customDateTime?: Date;

  location?: {
    lat?: number;
    lng?: number;
    label?: string;
  };

  important: boolean;

  reflection?: {
    summary?: string;
    emotions?: string[];
    themes?: string[];
    processedAt?: Date;
    version?: number;
  };

  embeddingId?: string;
}

const MemorySchema = new Schema<IMemory>(
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

    richTextContent: {
      type: String,
      required: true,
    },

    mood: {
      type: String,
      enum: ["great", "good", "neutral", "low", "bad"],
    },

    tags: {
      type: [String],
      default: [],
      index: true,
    },

    customDateTime: Date,

    location: {
      lat: Number,
      lng: Number,
      label: String,
    },

    important: {
      type: Boolean,
      default: false,
      index: true,
    },

    reflection: {
      summary: String,
      emotions: [String],
      themes: [String],
      processedAt: Date,
      version: Number,
    },

    embeddingId: {
      type: String,
      index: true,
    },
  },
  { timestamps: true },
);

MemorySchema.index({ userId: 1, createdAt: -1 });
MemorySchema.index({ userId: 1, tags: 1 });
MemorySchema.index({ title: "text", richTextContent: "text" });

export const Memory = model<IMemory>("Memory", MemorySchema);
