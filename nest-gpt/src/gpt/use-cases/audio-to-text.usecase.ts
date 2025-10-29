import OpenAI from "openai";
import * as fs from 'fs'

interface Options {
  dto: any;
  audioFile: Express.Multer.File
}

export const audioToTextUseCase = async (openAI: OpenAI, options: Options) => {
  const { dto, audioFile } = options

  const response = await openAI.audio.transcriptions.create({
    model: 'whisper-1',
    file: fs.createReadStream(audioFile.path),
    prompt: dto.prompt,
    language: 'es',
    response_format: 'verbose_json',
  })

  return response
}