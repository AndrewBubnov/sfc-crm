import { useContext } from 'react';
import { Table } from '@/ui/table.tsx';
import { Skeleton } from '@/modules/shared/components/Skeleton.tsx';
import { DataTableHeader } from '@/modules/table/components/DataTableHeader.tsx';
import { TableContext } from '@/providers/TableContext.ts';
import { useGetQueryDetails } from '@/modules/shared/hooks/useGetQueryDetails.ts';
import { DataTableBody } from '@/modules/table/components/DataTableBody.tsx';

export const DataTable = () => {
	const { table } = useContext(TableContext);
	const { isInitFetching } = useGetQueryDetails();

	return (
		<div className="rounded-md border">
			<Skeleton isLoading={isInitFetching} className="w-full h-[488px] rounded-md">
				<Table>
					<DataTableHeader headerGroups={table.getHeaderGroups()} />
					<DataTableBody rows={table.getRowModel().rows} />
				</Table>
			</Skeleton>
		</div>
	);
};
