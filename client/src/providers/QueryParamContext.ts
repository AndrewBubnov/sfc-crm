import { createContext } from 'react';
import { useManageSearchParams } from '@/modules/shared/hooks/useManageSearchParams.ts';

export type QueryParamContextProps = ReturnType<typeof useManageSearchParams>;

export const QueryParamContext = createContext<QueryParamContextProps>({} as QueryParamContextProps);
