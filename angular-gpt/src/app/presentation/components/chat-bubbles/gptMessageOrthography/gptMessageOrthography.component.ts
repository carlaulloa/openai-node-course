import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-gpt-message-orthography',
  imports: [],
  templateUrl: './gptMessageOrthography.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GptMessageOrthographyComponent {
  userScore = input.required<number>();
  text = input.required<string>();
  errors = input<string[]>([]);

  ngOnInit() {
    console.log('GptMessageOrthographyComponent initialized with:', {
      userScore: this.userScore(),
      text: this.text(),
      errors: this.errors(),
    });
  }

 }
