import { InternalServerErrorException } from "@nestjs/common"
import * as path from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';

export const downloadImageAsPng = async (url: string) => {

  const response = await fetch(url)

  if (!response.ok) {
    throw new InternalServerErrorException('Failed to download image')
  }

  const folderPath = path.resolve('./', './generated/images/')

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true })
  }

  const imageName = `${new Date().getTime()}.png`

  const buffer = Buffer.from(await response.arrayBuffer())

  const completedPath = path.join(folderPath, imageName)

  await sharp(buffer)
    .png()
    .ensureAlpha()
    .toFile(completedPath)

  return imageName
}

export const downloadBase64ImageAsPng = async (base64Image: string) => {
  base64Image = base64Image.split(';base64,').pop()! 
  const imageBuffer = Buffer.from(base64Image, 'base64')

  const folderPath = path.resolve('./', './generated/images/')

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true })
  }

  const imageName = `${new Date().getTime()}-64.png`

  const completedPath = path.join(folderPath, imageName)

  await sharp(imageBuffer)
    .png()
    .ensureAlpha()
    .toFile(completedPath)

  return imageName
}