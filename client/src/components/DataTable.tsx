import { useContext } from 'react';
import { Table } from '@/components/ui/table.tsx';
import { Skeleton } from '@/components/Skeleton.tsx';
import { DataTableHeader } from '@/components/DataTableHeader.tsx';
import { TableContext } from '@/providers/TableContext.ts';
import { useGetQueryDetails } from '@/hooks/useGetQueryDetails.ts';
import { DataTableBody } from '@/components/DataTableBody.tsx';

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
