import { UseMutateAsyncFunction } from '@tanstack/react-query'

export interface IFormsMutator {
  mutateAsync: UseMutateAsyncFunction<{ data: unknown }, Error, unknown, unknown>
}
