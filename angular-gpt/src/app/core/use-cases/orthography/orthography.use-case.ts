import { OrthographyResponse } from '@interfaces/orthography.reponse';
import { environment } from 'environments/environment.development';

export const orthographyUseCase = async (
  prompt: string
): Promise<OrthographyResponse> => {
  try {
    const response = await fetch(
      `${environment.backendApi}/orthography-check`,
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

    const data = (await response.json()) as OrthographyResponse;
    return {
      ...data,
      ok: true
    }
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      userScore: 0,
      errors: [],
      message: 'No se pudo realizar la operación',
    };
  }
};
