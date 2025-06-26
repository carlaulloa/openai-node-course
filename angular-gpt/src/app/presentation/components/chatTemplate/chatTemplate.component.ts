import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ChatMessageComponent } from '@components/chat-bubbles/chatMessage/chatMessage.component';
import { MyMessageComponent } from '@components/chat-bubbles/myMessage/myMessage.component';
import { TypingLoaderComponent } from '@components/typingLoader/typingLoader.component';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';
import { TextMessageBoxComponent, TextMessageBoxEvent, TextMessageEvent } from '@components/index';

@Component({
  selector: 'app-chat-template',
  imports: [ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent],
  templateUrl: './chatTemplate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatTemplateComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);

  public openAiService = inject(OpenAiService);

  handleMessage(prompt: string) {
    console.log({ prompt });
  }
}
