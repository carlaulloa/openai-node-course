import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GptService } from './gpt.service';
import { AudioToTextDto, ImageGenerationDto, ImageVariationDto, OrthographyDto, TextToAudioDto, TranslateDto } from './dtos';
import { ProsConsDiscusserDto } from './dtos/pros-cons-discusser.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() response: Response
  ) {
    const filePath = await this.gptService.textToAudio(textToAudioDto)
    
    response.setHeader('Content-Type', 'audio/mp3')
    response.status(HttpStatus.OK)
    response.sendFile(filePath)
  }

  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Res() response: Response,
    @Param('fileId') fileId: string
  ) {
    const filePath = await this.gptService.textToAudioGetter(fileId)
    
    response.setHeader('Content-Type', 'audio/mp3')
    response.status(HttpStatus.OK)
    response.sendFile(filePath)
  }

  @Post('audio-to-text')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './generated/uploads',
      filename: (req, file, callback) => {
        console.log(file.mimetype)
        const fileExtension = file.originalname.split('.').pop()
        const filename = `${new Date().getTime()}-${file.originalname}.${fileExtension}`
        return callback(null, filename)
      }
    })
  }))
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 5,
            message: 'File size must be less than 5MB'
          }),
          /*new FileTypeValidator({
            fileType: 'audio/mp4',
          })*/
        ]
      })
    ) file: Express.Multer.File,
    @Body() audioToTextDto: AudioToTextDto
  ) {
    return this.gptService.audioToText({
      audioFile: file,
      dto: audioToTextDto
    })
  }


  @Post('image-generation')
  async imageGeneration(@Body() imageGenerationDto: ImageGenerationDto) {
    return this.gptService.imageGeneration(imageGenerationDto)
  }

  @Get('image-generation/:fileId')
  async imageGenerationGetter(
    @Res() response: Response,
    @Param('fileId') fileId: string
  ) {
    const filePath = await this.gptService.getImageGenerationGetter(fileId)
    
    response.status(HttpStatus.OK)
    response.sendFile(filePath)
  }

  @Post('image-variation')
  async imageVariation(@Body() imageVariationDto: ImageVariationDto) {
    return this.gptService.generateImageVariation(imageVariationDto)
  }


}
