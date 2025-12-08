import { Module } from '@nestjs/common';
import { GptModule } from './gpt/gpt.module';
import { ConfigModule } from '@nestjs/config';
import { TestAssistantModule } from './test-assistant/test-assistant.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GptModule,
    TestAssistantModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
