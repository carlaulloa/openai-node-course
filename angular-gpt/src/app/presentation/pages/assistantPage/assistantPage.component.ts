import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  ChatMessageComponent,
  MyMessageComponent,
  TextMessageBoxComponent,
  TypingLoaderComponent,
} from '@components/index';
import { Message } from '@interfaces/index';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-assistant-page',
  imports: [
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
  ],
  templateUrl: './assistantPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AssistantPageComponent implements OnInit {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);

  public openAiService = inject(OpenAiService);

  public threadId = signal<string | null>(null);

  ngOnInit(): void {
    this.openAiService.createThread().subscribe(threadId => {
      this.threadId.set(threadId);
    })
  }

  handleMessage(question: string) {
    this.isLoading.set(true);
    this.messages.update(messages => [...messages, { text: question, isGpt: false }]);

    this.openAiService.postQuestion(this.threadId()!, question).subscribe(messages => {
      this.isLoading.set(false);
      for (const reply of messages) {
        for (const message of reply.content) {
          this.messages.update(messages => [...messages, { text: message, isGpt: reply.role === 'assistant' }])          
        }
      }
    })
  }
}
