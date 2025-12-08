import { environment } from "environments/environment"

export const createThreadUseCase = async () => {
    try {
      const response = await fetch(`${environment.assistantApi}/create-thread`, {
        method: 'POST'
      })
      const { id } = await response.json()
      return id;
    } catch (error) {
      throw new Error('error creating thread')
    }
}