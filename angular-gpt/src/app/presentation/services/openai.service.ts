import { Injectable } from '@angular/core';
import { audioToTextUseCase, createThreadUseCase, imageGenerationUseCase, imageVariationUseCase, postQuestionUseCase, prosConsStreamUseCase, prosConsUseCase, textToAudioUseCase } from '@use-cases/index';
import { orthographyUseCase } from '@use-cases/orthography/orthography.use-case';
import { translateUseCase } from '@use-cases/translate/translate.usecase';
import { from, Observable, of, tap } from 'rxjs';

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

  audioToText(audioFile: File, prompt?: string) {
    return from(audioToTextUseCase(audioFile, prompt));
  }

  imageGeneration(prompt: string, originalImage?: string, maskImage?: string) {
    return from(imageGenerationUseCase(prompt, originalImage, maskImage))
  }

  imageVariation(originalImage: string) {
    return from(imageVariationUseCase(originalImage))
  }

  createThread(): Observable<string> {
    if (localStorage.getItem('thread')) {
      return of(localStorage.getItem('thread')!);
    }

    return from(createThreadUseCase())
      .pipe(
        tap(threadId => localStorage.setItem('thread', threadId))
      )
  }

  postQuestion(threadId: string, question: string) {
    return from(postQuestionUseCase(threadId, question));
  }

}


