import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatMessageComponent, MyMessageComponent, TextMessageBoxComponent, TypingLoaderComponent, TextMessageBoxSelectComponent, TextMessageBoxEvent } from '@components/index';
import { Message } from '@interfaces/index';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-text-to-audio-page',
  imports: [
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
    TextMessageBoxSelectComponent
],
  templateUrl: './textToAudioPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TextToAudioPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);

  public openAiService = inject(OpenAiService);

  public voices = signal([
    { id: "nova", text: "Nova" },
    { id: "alloy", text: "Alloy" },
    { id: "echo", text: "Echo" },
    { id: "fable", text: "Fable" },
    { id: "onyx", text: "Onyx" },
    { id: "shimmer", text: "Shimmer" },
  ]);

  handleMessageWithSelect({ prompt, selectedOption }: TextMessageBoxEvent) {
    const message = `${selectedOption} - ${prompt}`;
    this.messages.update(prev => [...prev, { text: message, isGpt: false }])
    this.isLoading.set(true);

    this.openAiService.textToAudio(message, selectedOption).subscribe({
      next: (response) => {
        this.messages.update(prev => [...prev, { text: response.message, audioUrl: response.audioUrl, isGpt: true }])
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    })

  }
}
