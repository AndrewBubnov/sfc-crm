import { PaginatedDataContext } from '@/providers/PaginatedDataContext.ts';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { usePaginatedDeviceListData } from '@/hooks/usePaginatedDeviceListData.ts';

type PaginatedDataProviderProps = {
	children: ReactNode;
};

export const PaginatedDataProvider = ({ children }: PaginatedDataProviderProps) => {
	const [sortBy, setSortBy] = useState<string>('');
	const [sortDesc, setSortDesc] = useState<boolean>(false);
	const data = usePaginatedDeviceListData({ sortBy, sortDesc });
	const onSortChange = useCallback(
		({ sortedBy, sortedDesc }: { sortedBy: string; sortedDesc: boolean }) => {
			setSortBy(prevState => (prevState === sortedBy && sortedDesc === sortDesc ? '' : sortedBy));
			setSortDesc(sortedDesc);
		},
		[sortDesc]
	);
	const paginatedDataValue = useMemo(
		() => ({
			sortBy,
			sortDesc,
			onSortChange,
			...data,
		}),
		[data, onSortChange, sortBy, sortDesc]
	);
	return <PaginatedDataContext.Provider value={paginatedDataValue}>{children}</PaginatedDataContext.Provider>;
};
