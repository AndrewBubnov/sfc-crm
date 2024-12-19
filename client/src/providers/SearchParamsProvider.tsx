import { ReactNode } from 'react';
import { SearchParamsContext } from '@/providers/SearchParamsContext.ts';
import { useManageSearchParams } from '@/modules/shared/hooks/useManageSearchParams.ts';

type SearchParamsProviderProps = {
	children: ReactNode;
};

export const SearchParamsProvider = ({ children }: SearchParamsProviderProps) => {
	const data = useManageSearchParams();
	return <SearchParamsContext.Provider value={data}>{children}</SearchParamsContext.Provider>;
};
