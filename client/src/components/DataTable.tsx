import { useContext } from 'react';
import { flexRender } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table.tsx';
import { Skeleton } from '@/components/Skeleton.tsx';
import { DataTableHeader } from '@/components/DataTableHeader.tsx';
import { DataContext } from '@/providers/DataContext.ts';
import { TableContext } from '@/providers/TableContext.ts';
import { columns } from '@/columns.tsx';

export const DataTable = () => {
	const { table } = useContext(TableContext);
	const { isInitFetching } = useContext(DataContext);

	return (
		<div className="rounded-md border">
			<Skeleton isLoading={isInitFetching} className="w-full h-[488px] rounded-md">
				<Table>
					<DataTableHeader headerGroups={table.getHeaderGroups()} />
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map(cell => (
										<TableCell
											key={cell.id}
											className="border border-gray-100 py-1 [&:has([role=checkbox])]:pr-2"
										>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</Skeleton>
		</div>
	);
};
