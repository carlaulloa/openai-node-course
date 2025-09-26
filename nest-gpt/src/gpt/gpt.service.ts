import { Injectable, NotFoundException } from '@nestjs/common';
import { orthographyCheckUseCase, prosConsDiscusserStreamUseCase, prosConsDiscusserUseCase, textToAudioUseCase, translateUseCase } from './use-cases';
import { OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';
import OpenAI from 'openai';
import * as path from 'path';
import * as fs from 'fs'

@Injectable()
export class GptService {

  private openAi = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUseCase(this.openAi, {
      prompt: orthographyDto.prompt
    });
  }

  async prosConsDiscusser({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDiscusserUseCase(this.openAi, {
      prompt
    });
  }

  async prosConsDiscusserStream({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDiscusserStreamUseCase(this.openAi, {
      prompt
    });
  }

  async translate({ prompt, lang }: TranslateDto) {
    return await translateUseCase(this.openAi, {
      prompt,
      lang
    });
  }

  async textToAudio({ prompt, voice }: TextToAudioDto) {
    return await textToAudioUseCase(this.openAi, {
      prompt,
      voice
    });
  }

  async textToAudioGetter(fileId: string) {
    const filePath = path.resolve(__dirname, `../../generated/audios/${fileId}.mp3`)
    
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found')
    }

    return filePath

  }

}
