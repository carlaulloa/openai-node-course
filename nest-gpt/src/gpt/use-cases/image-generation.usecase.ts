import OpenAI from 'openai';
import { downloadBase64ImageAsPng, downloadImageAsPng } from 'src/helpers';
import * as fs from 'fs';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGenerationUseCase = async (
  openAi: OpenAI,
  options: Options,
) => {
  const { prompt, originalImage, maskImage } = options;

  if (!originalImage || !maskImage) {
    const response = await openAi.images.generate({
      prompt,
      model: 'dall-e-3',
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    });
    const imageName = await downloadImageAsPng(response.data![0].url!);
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${imageName}`;
    
    return {
      url,
      openAIUrl: response.data![0].url,
      revised_prompt: response.data![0].revised_prompt,
    };
  }

  const pngImagePath = await downloadImageAsPng(originalImage);
  const maskPath = await downloadBase64ImageAsPng(maskImage);

  const response = await openAi.images.edit({
    model: 'dall-e-3',
    image: fs.createReadStream(pngImagePath),
    mask: fs.createReadStream(maskPath),
    prompt,
    n: 1,
    size: '1024x1024',
    quality: 'standard',
    response_format: 'url',
  });

  const imageName = await downloadImageAsPng(response.data![0].url!);
  const url = `${process.env.SERVER_URL}/gpt/image-generation/${imageName}`;

  return {
    url,
    openAIUrl: response.data![0].url,
    revised_prompt: response.data![0].revised_prompt,
  };
};
