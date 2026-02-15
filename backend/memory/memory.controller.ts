import { Response } from "express";
import { AuthRequest } from "../auth/middleware";
import { Memory } from "./memory.model";

/* create memory */
export const createMemory = async (req: AuthRequest, res: Response) => {
  try {
    const { richTextContent, customDateTime, location, important } = req.body;

    if (!richTextContent || typeof richTextContent !== "string") {
      return res.status(400).json({ error: "Invalid content" });
    }

    const memory = await Memory.create({
      userId: req.userId,
      richTextContent,
      customDateTime,
      location,
      important,
    });

    res.status(201).json(memory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create memory" });
  }
};

/* list memories (paginated) */
export const getMemories = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const memories = await Memory.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(memories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch memories" });
  }
};

/* get single memory */
export const getMemory = async (req: AuthRequest, res: Response) => {
  try {
    const memory = await Memory.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!memory) {
      return res.status(404).json({ error: "Memory not found" });
    }

    res.json(memory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch memory" });
  }
};

/* update memory */
export const updateMemory = async (req: AuthRequest, res: Response) => {
  try {
    const { richTextContent, customDateTime, location, important } = req.body;

    const memory = await Memory.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!memory) {
      return res.status(404).json({ error: "Memory not found" });
    }

    const contentChanged =
      richTextContent && richTextContent !== memory.richTextContent;

    if (richTextContent) memory.richTextContent = richTextContent;
    if (customDateTime !== undefined) memory.customDateTime = customDateTime;
    if (location !== undefined) memory.location = location;
    if (important !== undefined) memory.important = important;

    if (contentChanged) {
      memory.reflection = undefined;
      memory.embeddingId = undefined;
    }

    await memory.save();

    res.json(memory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update memory" });
  }
};

/* delete memory */
export const deleteMemory = async (req: AuthRequest, res: Response) => {
  try {
    const memory = await Memory.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!memory) {
      return res.status(404).json({ error: "Memory not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete memory" });
  }
};
