import {
  ChangeDetectionStrategy,
  Component,
  inject,
  SecurityContext,
  signal,
} from '@angular/core';
import {
  ChatMessageComponent,
  MyMessageComponent,
  TypingLoaderComponent,
  TextMessageBoxComponent,
} from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-pros-cons-stream-page',
  imports: [
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
  ],
  templateUrl: './prosConsStreamPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProsConsStreamPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);

  public openAiService = inject(OpenAiService);

  public abortSignal = new AbortController()

  async handleMessage(prompt: string) {

    this.abortSignal.abort()
    this.abortSignal = new AbortController()

    this.isLoading.set(true);
    this.messages.update((prev) => [...prev, 
      { text: prompt, isGpt: false },
      { text: '...', isGpt: true }
    ]);
    const stream = this.openAiService.prosConsDiscusserStream(prompt, this.abortSignal.signal);
    this.isLoading.set(false);
    for await (const chunk of stream) {
      this.handleStreamResponse(chunk)
    }
  }

  handleStreamResponse(message: string) {
    this.messages().pop()
    const messages = this.messages()

    this.messages.set([...messages, { text: message, isGpt: true }])
  }
}
