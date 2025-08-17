import OpenAI from "openai";

interface Options {
  prompt: string;
  lang: string;
}

export const translateUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt, lang } = options;

  const response = await openai.responses.create({
    model: 'gpt-4.1',
    input: [
      {
        role: 'system',
        content: `Traduce el siguiente texto al idioma ${lang}: ${prompt}
        Ejemplo de Salida:
        {
          "message": string // translation
        }`,
      },
    ],
    temperature: 0.8,
    max_output_tokens: 500,
  });
  const json = JSON.parse(response.output[0]['content'][0].text);

  return json;
};