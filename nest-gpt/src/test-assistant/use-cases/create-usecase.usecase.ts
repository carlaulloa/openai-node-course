import OpenAI from "openai";

interface Options {
  threadId: string;
  assistantId?: string
}

export const createRunUseCase = async (
  openai: OpenAI,
  options: Options
) => {
  const { threadId, assistantId = 'asst_aUPtMMl1COcIN2H2iQY9BTkm' } = options;

  const run = await openai.beta.threads.runs.create(
    threadId, {
      assistant_id: assistantId,
      // instructions -> override the assistant
    }
  )

  return run;
}