import { ReactNode } from 'react';
import { MainProvider } from '../contexts/MainContext';

type Props = { children?: ReactNode };

export function AppProviders({ children }: Props) {
  return (
    <MainProvider>
        {children}
    </MainProvider>
  )
}