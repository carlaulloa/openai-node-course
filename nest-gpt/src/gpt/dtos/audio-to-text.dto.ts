import { IsOptional, IsString } from "class-validator";

export class AudioToTextDto {
  @IsString()
  readonly prompt: string;
}