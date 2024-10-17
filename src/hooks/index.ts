import { RootState, AppDispatch } from '@redux-store'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

export * from './useAnimation'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
