import OpenAI from "openai";

interface Options {
  threadId: string;
}

export const getMessageListUseCase = async (openai: OpenAI, options: Options) => {
  const { threadId } = options
  const messageList = await openai.beta.threads.messages.list(threadId);

  const messages = messageList.data.map(item => ({
    role: item.role,
    content: item.content.map(content => (content as any).text.value)
  }))

  return messages;
}