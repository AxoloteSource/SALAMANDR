/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'

type RefreshKeyService = (params: any) => { data: unknown; isLoading: boolean; refetch: () => void }

interface IUseRefreshKeyProps {
  module?: string
  service: RefreshKeyService
  close?: () => void
  payload?: Record<string, unknown>
}

export const useRefreshKey = ({ module = '', service, close, payload = {} }: IUseRefreshKeyProps) => {
  const [key, setKey] = useState<number>(0)
  const { refetch } = service({
    ...payload,
    page: 1,
    filters: []
  })
  const handleRefetch = async () => {
    setKey((prev) => prev + 1)
    await refetch()
  }
  const refreshKey = `${module}-table-${key}`

  const handleSuccess = () => {
    if (close) {
      close()
    }
    handleRefetch()
  }
  return {
    refreshKey,
    handleRefetch,
    handleSuccess
  }
}
