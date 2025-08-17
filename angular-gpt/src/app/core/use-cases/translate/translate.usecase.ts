import { TranslateResponse } from '@interfaces/translate.response';
import { environment } from 'environments/environment.development';

export const translateUseCase = async (prompt: string, lang: string): Promise<{ ok: boolean; message: string }> => {
  try {
    const response = await fetch(
      `${environment.backendApi}/translate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, lang }),
      }
    );

    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }

    const data = (await response.json()) as TranslateResponse;
    return { ok: true, ...data };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo realizar la operación',
    };
  }
};
