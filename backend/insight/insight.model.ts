import { Schema, model, Document, Types } from "mongoose";

export interface IInsight extends Document {
  userId: Types.ObjectId;
  title: string;
  content: string;
  sourceMemoryIds: Types.ObjectId[];
  generatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InsightSchema = new Schema<IInsight>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    sourceMemoryIds: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    generatedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true },
);

InsightSchema.index({ userId: 1, generatedAt: -1 });

export const Insight = model<IInsight>("Insight", InsightSchema);
