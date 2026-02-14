import { Schema, model, Document, Types } from "mongoose";

export interface IMemory extends Document {
  userId: Types.ObjectId;

  richTextContent: string;

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

    richTextContent: {
      type: String,
      required: true,
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
  { timestamps: true }
);

MemorySchema.index({ userId: 1, createdAt: -1 });

export const Memory = model<IMemory>("Memory", MemorySchema);
