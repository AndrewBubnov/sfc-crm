import { createContext } from 'react';
import { useManageSearchParams } from '@/modules/shared/hooks/useManageSearchParams.ts';

export type SearchParamsContextProps = ReturnType<typeof useManageSearchParams>;

export const SearchParamsContext = createContext<SearchParamsContextProps>({} as SearchParamsContextProps);
