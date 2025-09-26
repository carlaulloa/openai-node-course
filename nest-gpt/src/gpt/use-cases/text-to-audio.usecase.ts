import OpenAI from "openai";
import * as path from 'path'
import * as fs from 'fs'

interface Options {
  prompt: string;
  voice?: string;
}

export const textToAudioUseCase = async (OpenAI: OpenAI, {
  prompt, voice = 'nova'
}: Options) => {

  const voices = {
    'nova': 'nova',
    'alloy': 'alloy',
    'ash': 'ash',
    'ballad': 'ballad',
    'coral': 'coral',
    'echo': 'echo',
    'fable': 'fable',
    'onyx': 'onyx',
    'sage': 'sage',
    'shimmer': 'shimmer',
    'verse': 'verse'
  }
  const selectedVoice = voices[voice]

  const folderPath = path.resolve(__dirname, '../../../generated/audios')
  const speachFile = path.resolve(folderPath, `${new Date().getTime()}.mp3`)

  fs.mkdirSync(folderPath, { recursive: true })

  const mp3 = await OpenAI.audio.speech.create({
    model: 'tts-1',
    input: prompt,
    voice: selectedVoice,
    response_format: 'mp3'
  })

  const buffer = Buffer.from(await mp3.arrayBuffer())

  fs.writeFileSync(speachFile, buffer)

  return speachFile
}