import { Response } from "express";
import { AuthRequest } from "../types/express";
import { asyncHandler } from "../utils/async-handler";
import {
  listInsights,
  getInsightById,
  deleteInsight,
  generateInsights,
} from "../services/insight.service";
import {
  ListInsightsInput,
  GenerateInsightsInput,
} from "../validators/insight.validator";

export const getInsights = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const insights = await listInsights(
      req.userId!,
      req.query as unknown as ListInsightsInput,
    );
    res.json(insights);
  },
);

export const getInsight = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const insight = await getInsightById(req.userId!, id);
    res.json(insight);
  },
);

export const deleteInsightHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await deleteInsight(req.userId!, id);
    res.json(result);
  },
);

export const generateInsightsHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const insight = await generateInsights(
      req.userId!,
      req.body as GenerateInsightsInput,
    );
    res.status(201).json(insight);
  },
);
