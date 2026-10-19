import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

export function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  const QueryClientWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  QueryClientWrapper.displayName = 'QueryClientWrapper'
  return QueryClientWrapper
}
