import { Injectable } from '@angular/core';
import { prosConsStreamUseCase, prosConsUseCase } from '@use-cases/index';
import { orthographyUseCase } from '@use-cases/orthography/orthography.use-case';
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
}
