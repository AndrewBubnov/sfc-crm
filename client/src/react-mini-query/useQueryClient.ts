import { useContext } from 'react';
import { QueryContext } from '@/react-mini-query/QueryContext.ts';

export const useQueryClient = () => useContext(QueryContext);
