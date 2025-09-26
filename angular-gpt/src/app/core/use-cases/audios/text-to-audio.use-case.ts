import { TextToAudioResponse } from '@interfaces/index';
import { OrthographyResponse } from '@interfaces/orthography.reponse';
import { environment } from 'environments/environment.development';

export const textToAudioUseCase = async (
  prompt: string,
  voice: string
): Promise<TextToAudioResponse> => {
  try {
    const response = await fetch(
      `${environment.backendApi}/text-to-audio`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, voice }),
      }
    );

    if (!response.ok) {
      throw new Error('Error en la generación del audio');
    }

    const audioFile = await response.blob();
    const audioUrl = URL.createObjectURL(audioFile);

    return {
      message: prompt,
      audioUrl,
      ok: true
    }
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo realizar la operación',
      audioUrl: '',
    };
  }
};
