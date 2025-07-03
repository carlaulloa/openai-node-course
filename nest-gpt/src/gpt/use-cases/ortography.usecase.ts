import OpenAI from 'openai';
interface Options {
  prompt: string;
}

export const orthographyCheckUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  const response = await openai.responses.create({
    model: 'gpt-4.1',
    input: [
      {
        role: 'system',
        content: 'Te serán proveídos textos con posibles errores ortográficos y gramáticales. Debes de responder en formato JSON. Tu tarea es corregirlos y retornar soluciones, también debes de dar un porcentaje de acierto por el usuario. Si no hay errores, debes de retornar un mensaje de felicitaciones.'
      },
      {
        role: 'user',
        content: `${prompt}`,
      }
    ],
  });
    console.log(response);
  const jsonResponse = JSON.parse(response.output[0]['content'][0].text);

  return {
    output: jsonResponse
  };
};
