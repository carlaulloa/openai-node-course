import { ProsConsResponse } from '@interfaces/pros-cons.response';
import { environment } from 'environments/environment.development';

export const prosConsUseCase = async (prompt: string): Promise<{ ok: boolean; role: string; content: string }> => {
  try {
    const response = await fetch(
      `${environment.backendApi}/pros-cons-discusser`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }

    const data = (await response.json()) as ProsConsResponse;
    return { ok: true, ...data };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      role: '',
      content: 'No se pudo realizar la operación',
    };
  }
};
