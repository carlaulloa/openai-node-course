import { QuestionResponse } from "@interfaces/index";
import { environment } from "environments/environment"

export const postQuestionUseCase = async (
  threadId: string,
  question: string
) => {
    try {
      const response = await fetch(`${environment.assistantApi}/user-question`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          threadId,
          question
        })
      })
      const { messages } = await response.json();
      return messages;
    } catch (error) {
      throw new Error('error getting messages')
    }
}