import { flexRender, getCoreRowModel, useReactTable, VisibilityState } from '@tanstack/react-table';
import { useCallback, useState } from 'react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table.tsx';
import { usePaginatedDeviceListData } from '@/hooks/usePaginatedDeviceListData.ts';
import { columns } from '@/columns.tsx';
import { useDebounced } from '@/hooks/useDebounced.ts';
import { ColumnManager } from '@/components/ColumnManager.tsx';
import { Pagination } from '@/components/Pagination.tsx';
import { Skeleton } from '@/components/Skeleton.tsx';
import { filterResolver, initialFilters } from '@/constants.ts';
import { LimitManager } from '@/components/LimitManager.tsx';
import { DataTableHeader } from '@/components/DataTableHeader.tsx';
import { RegisterDeviceSheet } from '@/components/RegisterDeviceSheet.tsx';
import { Filter } from '@/types.ts';

export const DataTable = () => {
	const [filtersList, setFiltersList] = useState<Filter[]>(initialFilters);
	const [sortBy, setSortBy] = useState<string>('');
	const [sortDesc, setSortDesc] = useState<boolean>(false);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

	const debouncedFiltersList = useDebounced(filtersList, filterResolver);

	const { data, paginationData, isInitFetching } = usePaginatedDeviceListData({
		filters: debouncedFiltersList,
		sortBy,
		sortDesc,
	});

	const onSortChange = useCallback(
		({ sortedBy, sortedDesc }: { sortedBy: string; sortedDesc: boolean }) => {
			setSortBy(prevState => (prevState === sortedBy && sortedDesc === sortDesc ? '' : sortedBy));
			setSortDesc(sortedDesc);
		},
		[sortDesc]
	);

	const onFilterChange = useCallback(
		({ search, field }: Filter) => {
			console.log({ search, field });
			return setFiltersList(prevState =>
				prevState.map(el => {
					if (el.field === field) return { search, field };
					return el;
				})
			);
		},

		[]
	);

	const table = useReactTable({
		data,
		columns,
		state: { columnVisibility },
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		columnResizeMode: 'onChange',
	});

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<Skeleton isLoading={isInitFetching} className="w-full h-8 rounded-md">
					<RegisterDeviceSheet />
					<ColumnManager columns={table.getAllColumns()} />
				</Skeleton>
			</div>
			<div className="rounded-md border">
				<Skeleton isLoading={isInitFetching} className="w-full h-[568px] rounded-md">
					<Table>
						<DataTableHeader
							headerGroups={table.getHeaderGroups()}
							filters={filtersList}
							onFilterChange={onFilterChange}
							sortBy={sortBy}
							sortDesc={sortDesc}
							onSortChange={onSortChange}
						/>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map(row => (
									<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
										{row.getVisibleCells().map(cell => (
											<TableCell key={cell.id} className="border border-gray-100 py-1">
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
				<LimitManager
					limit={paginationData.limit}
					onLimitChange={paginationData.onChangeLimit}
					isLoading={isInitFetching}
				/>
				<Pagination paginationData={paginationData} isLoading={isInitFetching} />
			</div>
		</div>
	);
};
