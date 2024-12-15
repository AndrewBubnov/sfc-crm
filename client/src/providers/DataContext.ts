import { createContext } from 'react';
import { useData } from '@/hooks/useData.ts';

export type PaginatedDataContextProps = {
	data: ReturnType<typeof useData>['data'];
	total: number;
	isFetching: boolean;
	limit: number;
	isInitFetching: boolean;
	onChangeLimit(arg: number): void;
};

export const DataContext = createContext<PaginatedDataContextProps>({} as PaginatedDataContextProps);
