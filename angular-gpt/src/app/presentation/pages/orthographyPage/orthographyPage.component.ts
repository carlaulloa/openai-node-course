import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  ChatMessageComponent,
  GptMessageOrthographyComponent,
  MyMessageComponent,
  TextMessageBoxComponent,
  TextMessageBoxEvent,
  TypingLoaderComponent,
} from '@components/index';
import {
  TextMessageBoxFileComponent,
  TextMessageEvent,
  TextMessageBoxSelectComponent,
} from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-orthography-page',
  imports: [
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
    TextMessageBoxFileComponent,
    TextMessageBoxSelectComponent,
    GptMessageOrthographyComponent
  ],
  templateUrl: './orthographyPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrthographyPageComponent {
  public messages = signal<Message[]>([{ text: 'Hello', isGpt: false }]);
  public isLoading = signal(false);

  public openAiService = inject(OpenAiService);

  handleMessage(prompt: string) {
    this.isLoading.set(true);
    this.messages.update((prev) => [...prev, { text: prompt, isGpt: false }]);

    this.openAiService.checkOrthography(prompt).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.messages.update((prev) => [
          ...prev,
          { text: response.message, isGpt: true, info: response },
        ]);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  handleMessagWithFile(prompt: TextMessageEvent) {
    console.log({ prompt });
  }

  handleMessagWithSelect(event: TextMessageBoxEvent) {}
}
