import { Module } from '@nestjs/common';
import { TestAssistantService } from './test-assistant.service';
import { TestAssistantController } from './test-assistant.controller';

@Module({
  controllers: [TestAssistantController],
  providers: [TestAssistantService],
})
export class TestAssistantModule {}
