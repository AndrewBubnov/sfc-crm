import { useContext } from 'react';
import { flexRender } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table.tsx';
import { ColumnManager } from '@/components/ColumnManager.tsx';
import { Pagination } from '@/components/Pagination.tsx';
import { Skeleton } from '@/components/Skeleton.tsx';
import { LimitManager } from '@/components/LimitManager.tsx';
import { DataTableHeader } from '@/components/DataTableHeader.tsx';
import { RegisterDeviceSheet } from '@/components/RegisterDeviceSheet.tsx';
import { ClearFilters } from '@/components/ClearFilters.tsx';
import { PaginatedDataContext } from '@/providers/PaginatedDataContext.ts';
import { columns } from '@/columns.tsx';
import { TableContext } from '@/providers/TableContext.ts';

export const DataTable = () => {
	const table = useContext(TableContext);
	const { isInitFetching } = useContext(PaginatedDataContext);

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<Skeleton isLoading={isInitFetching} className="w-full h-8 rounded-md">
					<div className="flex items-center gap-[100px]">
						<RegisterDeviceSheet />
						<ClearFilters />
					</div>
					<ColumnManager columns={table.getAllColumns()} />
				</Skeleton>
			</div>
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
			<div className="flex items-center justify-end gap-8">
				<LimitManager />
				<Pagination />
			</div>
		</div>
	);
};
