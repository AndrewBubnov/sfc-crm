import { createContext } from 'react';
import { usePaginatedDeviceListData } from '@/hooks/usePaginatedDeviceListData.ts';

export type PaginatedDataContextProps = {
	sortBy: string;
	sortDesc: boolean;
	onSortChange(arg: { sortedBy: string; sortedDesc: boolean }): void;
	data: ReturnType<typeof usePaginatedDeviceListData>['data'];
	paginationData: ReturnType<typeof usePaginatedDeviceListData>['paginationData'];
	isInitFetching: boolean;
};

export const PaginatedDataContext = createContext<PaginatedDataContextProps>({} as PaginatedDataContextProps);
