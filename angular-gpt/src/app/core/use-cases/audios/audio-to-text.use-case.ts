import { AudioToTextResponse } from "@interfaces/audio-to-text.interface";
import { environment } from "environments/environment";

export const audioToTextUseCase = async (
  audioFile: File,
  prompt?: string
) => {
  try {
    const formData = new FormData();
    formData.append('file', audioFile);

    if (prompt) {
      formData.append('prompt', prompt);
    }

    const response = await fetch(
      `${environment.backendApi}/audio-to-text`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Error en la generación del audio');
    }

    const data = await response.json() as AudioToTextResponse;

    return data;
  } catch (error) {
    console.log(error);
    return null; 
  }
}
