import OpenAI from 'openai';
import { downloadBase64ImageAsPng, downloadImageAsPng } from 'src/helpers';
import * as fs from 'fs';
import { toFile } from 'openai/uploads'

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
      model: 'dall-e-2',
      n: 1,
      size: '1024x1024',
    //  quality: 'standard',
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

  const pngImagePath = await downloadImageAsPng(originalImage, true);
  const maskPath = await downloadBase64ImageAsPng(maskImage, true);

  const response = await openAi.images.edit({
    model: 'dall-e-2',
    image: await toFile(fs.createReadStream(pngImagePath), null, {
      type: 'image/png'
    }),
    mask: await toFile(fs.createReadStream(maskPath), null, {
      type: 'image/png'
    }),
    prompt,
    n: 1,
    size: '1024x1024',
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
