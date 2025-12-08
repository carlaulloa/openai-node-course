import { Body, Controller, Post } from '@nestjs/common';
import { TestAssistantService } from './test-assistant.service';
import { QuestionDto } from './dtos/question.dto';

@Controller('test-assistant')
export class TestAssistantController {
  constructor(private readonly testAssistantService: TestAssistantService) {}

  // maintains history conversation
  @Post('create-thread')
  async createThread() {
    return await this.testAssistantService.createThread();
  }

  @Post('user-question')
  async userQuestion(
    @Body() questionDto: QuestionDto
  ) {
    return await this.testAssistantService.userQuestion(questionDto);
  }
}
