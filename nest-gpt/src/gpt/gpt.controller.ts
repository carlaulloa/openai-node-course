import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, TranslateDto } from './dtos';
import { ProsConsDiscusserDto } from './dtos/pros-cons-discusser.dto';
import { Response } from 'express';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(
    @Body() orthographyDto: OrthographyDto
  ) {
    return this.gptService.orthographyCheck(orthographyDto)
  }

  @Post('pros-cons-discusser')
  prosConsDiscusser(@Body() prosConsDiscusserDto: ProsConsDiscusserDto) {
    return this.gptService.prosConsDiscusser(prosConsDiscusserDto)
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDiscusserStream(@Body() prosConsDiscusserDto: ProsConsDiscusserDto, @Res() response: Response) {
    const stream = await this.gptService.prosConsDiscusserStream(prosConsDiscusserDto)
    
    response.setHeader('Content-Type', 'application/json')
    response.status(HttpStatus.OK)
    
    for await (const event of stream) {
      if (event.type === 'response.output_text.delta') {
        console.log(event.delta)
        response.write(event.delta)
      }
    }
    response.end()
  }

  @Post('translate')
  translate(@Body() translateDto: TranslateDto) {
    return this.gptService.translate(translateDto)
  }
}
