import { Response, NextFunction, RequestHandler } from "express";
import { ZodType } from "zod";
import { AppError } from "../utils/api-error";
import { AuthRequest } from "../types/express";

type RequestSource = "body" | "query" | "params";

export function validate<T>(
  schema: ZodType<T>,
  source: RequestSource = "body",
): RequestHandler {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const message = result.error.issues[0]?.message ?? "Invalid request";
      return next(new AppError(400, message));
    }

    if (source === "body") {
      req.validatedBody = result.data;
    } else if (source === "query") {
      req.validatedQuery = result.data;
    } else {
      req.validatedParams = result.data;
    }

    next();
  };
}
