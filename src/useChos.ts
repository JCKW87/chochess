import { useContext } from 'react'
import { ChosSettingsContext, type ChosContextValue } from './chosContext'

export function useChos(): ChosContextValue {
  const c = useContext(ChosSettingsContext)
  if (!c) throw new Error('useChos must be used within ChosProvider')
  return c
}
