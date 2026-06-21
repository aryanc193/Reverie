import { env } from "../../config/env";
import { AiService } from "./ai.interface";
import { stubAiService } from "./ai.stub";

export function getAiService(): AiService {
  switch (env.aiProvider) {
    case "stub":
    default:
      return stubAiService;
  }
}
