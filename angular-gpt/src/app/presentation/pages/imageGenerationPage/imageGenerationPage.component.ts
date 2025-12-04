import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatMessageComponent } from '@components/chat-bubbles/chatMessage/chatMessage.component';
import { MyMessageComponent } from '@components/chat-bubbles/myMessage/myMessage.component';
import { TextMessageBoxComponent } from '@components/index';
import { TypingLoaderComponent } from '@components/typingLoader/typingLoader.component';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-image-generation-page',
   imports: [ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent],
  templateUrl: './imageGenerationPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageGenerationPageComponent { 

    public messages = signal<Message[]>([]);
  public isLoading = signal(false);

  public openAiService = inject(OpenAiService);

  handleMessage(prompt: string) {
    this.isLoading.set(true);
    this.messages.update((messages) => [...messages, {
      isGpt: false,
      text: prompt
    }]);
    this.openAiService.imageGeneration(prompt).subscribe({
      next: (response) => {
        if (!response) return;
        this.isLoading.set(false);
        this.messages.update((messages) => [...messages, {
          isGpt: true,
          text: response.alt,
          imageInfo: response
        }]);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}
