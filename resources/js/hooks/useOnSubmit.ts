import { UseMutateAsyncFunction } from '@tanstack/react-query'
import { sileo } from 'sileo'

export const useOnSubmit = <Request = Record<string, unknown>, Response = Record<string, unknown>>({
  mutateAsync,
  onSuccess,
  formatData = (data: Request) => data,
  onError
}: {
  mutateAsync: UseMutateAsyncFunction<{ data: unknown }, Error, unknown, unknown>
  onSuccess: (data: Response) => void
  formatData?: (data: Request) => Request
  onError?: (data: Error) => void
}) => {
  const onSubmit = async (data: Request, { setErrors }: { setErrors: (errors: Record<string, unknown>) => void }) => {
    try {
      const res = await mutateAsync(formatData(data))
      onSuccess(res.data as Response)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { data?: Record<string, unknown>; message?: string } } }

      if (err.response?.data?.data != null) {
        setErrors(err.response.data.data)
      }

      if (onError) {
        onError(error as Error)
      } else if (err.response?.data?.message != null) {
        sileo.error({
          title: 'Error',
          description: err.response.data.message
        })
      }
    }
  }

  return {
    onSubmit
  }
}
