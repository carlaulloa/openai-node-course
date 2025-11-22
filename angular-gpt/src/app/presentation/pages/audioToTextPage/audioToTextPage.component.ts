import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatMessageComponent, MyMessageComponent, TextMessageBoxComponent, TextMessageBoxFileComponent, TypingLoaderComponent } from '@components/index';
import { AudioToTextResponse } from '@interfaces/audio-to-text.interface';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-audio-to-text-page',
 imports: [ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, 
  TextMessageBoxComponent, TextMessageBoxFileComponent],
  
  templateUrl: './audioToTextPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AudioToTextPageComponent { 
    public messages = signal<Message[]>([]);
  public isLoading = signal(false);

  public openAiService = inject(OpenAiService);

  handleSelectedFile({ prompt, file }: any) {
    const text = prompt ?? file.name ?? 'Traduce el audio';
    
    this.isLoading.set(true);
    this.messages.update((messages) => [
      ...messages,
      { text, isGpt: false },
    ]);
    
    this.openAiService.audioToText(file, text).subscribe({
      next: (response) => this.handleResponse(response),
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  handleResponse(response: AudioToTextResponse | null) {
    this.isLoading.set(false);
    if (!response) {
      return;
    }
    const text = `## Transcripción:
__Duración__: ${Math.round(response.duration)} segundos

## El texto es:
${response.text}
    `;

    this.messages.update((messages) => [
      ...messages,
      { text, isGpt: true },
    ]);

    for (const segment of response.segments) {
      const segmentMessage = `
__De ${Math.round(segment.start)} a ${Math.round(segment.end)} segundos.__
${segment.text}
      `
      
      this.messages.update((messages) => [
        ...messages,
        { text: segmentMessage, isGpt: true },
      ]);
    }

  }
}
