import { Injectable } from '@angular/core';
import { prosConsStreamUseCase, prosConsUseCase, textToAudioUseCase } from '@use-cases/index';
import { orthographyUseCase } from '@use-cases/orthography/orthography.use-case';
import { translateUseCase } from '@use-cases/translate/translate.usecase';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OpenAiService {
  checkOrthography(prompt: string) {
    return from(orthographyUseCase(prompt));
  }

  prosConsDiscusser(prompt: string) {
    return from(prosConsUseCase(prompt));
  }

  prosConsDiscusserStream(prompt: string, abortSignal: AbortSignal) {
    return prosConsStreamUseCase(prompt, abortSignal);
  }

  translate(prompt: string, lang: string) {
    return from(translateUseCase(prompt, lang));
  }

  textToAudio(prompt: string, voice: string) {
    return from(textToAudioUseCase(prompt, voice));
  }
}
