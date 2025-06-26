import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatMessageComponent, MyMessageComponent, TextMessageBoxComponent, TextMessageBoxEvent, TypingLoaderComponent } from '@components/index';
import { TextMessageBoxFileComponent, TextMessageEvent, TextMessageBoxSelectComponent } from '@components/index';
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
    TextMessageBoxSelectComponent
  ],
  templateUrl: './orthographyPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrthographyPageComponent { 

  public messages = signal<Message[]>([ { text: 'Hello', isGpt: false }])
  public isLoading = signal(false)

  public openAiService = inject(OpenAiService)

  handleMessage(prompt: string) {
    console.log({prompt})
  }

  handleMessagWithFile(prompt: TextMessageEvent) {
    console.log({prompt})
  }

  handleMessagWithSelect(event: TextMessageBoxEvent) {

  }
}
