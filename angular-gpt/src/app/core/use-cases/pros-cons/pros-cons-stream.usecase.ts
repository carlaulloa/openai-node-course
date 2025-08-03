import { ProsConsResponse } from "@interfaces/pros-cons.response";
import { environment } from "environments/environment.development";

export async function* prosConsStreamUseCase(prompt: string, abortSignal: AbortSignal) {
  try {
    const response = await fetch(
      `${environment.backendApi}/pros-cons-discusser-stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
        signal: abortSignal,
      }
    );

    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Error al leer la respuesta del servidor');
    }

    const decode = new TextDecoder();
    let text = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      text += decode.decode(value, { stream: true });
      yield text;
    }
    return text;

  } catch (error) {
    return null;
  }
}
