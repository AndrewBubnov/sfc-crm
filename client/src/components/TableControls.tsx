import { useContext } from 'react';
import { Skeleton } from '@/components/Skeleton.tsx';
import { RegisterDeviceSheet } from '@/components/RegisterDeviceSheet.tsx';
import { ClearFilters } from '@/components/ClearFilters.tsx';
import { ColumnManager } from '@/components/ColumnManager.tsx';
import { PaginatedDataContext } from '@/providers/PaginatedDataContext.ts';

export const TableControls = () => {
	const { isInitFetching } = useContext(PaginatedDataContext);
	return (
		<div className="flex items-center justify-between">
			<Skeleton isLoading={isInitFetching} className="w-full h-8 rounded-md">
				<div className="flex items-center gap-[100px]">
					<RegisterDeviceSheet />
					<ClearFilters />
				</div>
				<ColumnManager />
			</Skeleton>
		</div>
	);
};
