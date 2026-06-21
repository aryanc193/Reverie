import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodType } from "zod";
import { AppError } from "../utils/api-error";

type RequestSource = "body" | "query" | "params";

export function validate<T>(
  schema: ZodType<T>,
  source: RequestSource = "body",
): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const message = result.error.issues[0]?.message ?? "Invalid request";
      return next(new AppError(400, message));
    }

    req[source] = result.data as Request[typeof source];
    next();
  };
}
