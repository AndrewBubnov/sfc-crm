import { DataContext } from '@/providers/DataContext.ts';
import { ReactNode } from 'react';
import { useData } from '@/hooks/useData.ts';

type PaginatedDataProviderProps = {
	children: ReactNode;
};

export const DataProvider = ({ children }: PaginatedDataProviderProps) => {
	const data = useData();
	return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};
