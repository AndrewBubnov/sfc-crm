import { ReactNode } from 'react';
import { QueryParamContext } from '@/providers/QueryParamContext.ts';
import { useManageSearchParams } from '@/modules/shared/hooks/useManageSearchParams.ts';

type QueryParamProviderProps = {
	children: ReactNode;
};
export const QueryParamProvider = ({ children }: QueryParamProviderProps) => {
	const data = useManageSearchParams();
	return <QueryParamContext.Provider value={data}>{children}</QueryParamContext.Provider>;
};
