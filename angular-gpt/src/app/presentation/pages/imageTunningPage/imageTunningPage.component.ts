import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  ChatMessageComponent,
  GptMessageEditableImageComponent,
  MyMessageComponent,
  TextMessageBoxComponent,
  TypingLoaderComponent,
} from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-image-tunning-page',
  imports: [
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
    GptMessageEditableImageComponent,
  ],
  templateUrl: './imageTunningPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageTunningPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public originalImage = signal<string | undefined>(undefined);

  public openAiService = inject(OpenAiService);
  public maskImage = signal<string | undefined>(undefined);

  handleMessage(prompt: string) {
    this.isLoading.set(true);
    this.messages.update((messages) => [
      ...messages,
      {
        isGpt: false,
        text: prompt,
      },
    ]);
    this.openAiService.imageGeneration(prompt, this.originalImage(), this.maskImage()).subscribe({
      next: (response) => {
        if (!response) return;
        this.isLoading.set(false);
        this.messages.update((messages) => [
          ...messages,
          {
            isGpt: true,
            text: response.alt,
            imageInfo: response,
          },
        ]);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  generateVariation() {
    if (!this.originalImage()) return;
    this.isLoading.set(true);

    this.openAiService.imageVariation(this.originalImage()!).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (!response) return;
        this.messages.update((messages) => [
          ...messages,
          {
            isGpt: true,
            text: response.alt,
            imageInfo: response,
          },
        ]);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  handleImageChange(newImage: string, originalImage: string) {
    this.originalImage.set(originalImage);
    this.maskImage.set(newImage);
  }
}
