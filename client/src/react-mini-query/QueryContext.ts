import { createContext } from 'react';
import { QueryClient } from '@/react-mini-query/QueryClient.ts';

export const QueryContext = createContext<QueryClient<unknown>>({} as QueryClient<unknown>);
