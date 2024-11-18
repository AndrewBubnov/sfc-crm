import { flexRender, getCoreRowModel, useReactTable, VisibilityState } from '@tanstack/react-table';
import { useState } from 'react';
import { Input } from '@/components/ui/input.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx';
import { Button } from '@/components/ui/button.tsx';
import { usePaginatedDeviceListData } from '@/hooks/usePaginatedDeviceListData.ts';
import { columns } from '@/columns.tsx';
import { useDebounced } from '@/hooks/useDebounced.ts';
import { ColumnManager } from '@/components/ColumnManager.tsx';
import { Pagination } from '@/components/Pagination.tsx';
import { Skeleton } from '@/components/Skeleton.tsx';
import { searchResolver } from '@/constants.ts';

export const  DataTable = () => {
	const [searchString, setSearchString] = useState<string>('');
	const [isSorted, setIsSorted] = useState<boolean>(false);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

	const debouncedSearchString = useDebounced(searchString, searchResolver);

	const { data, paginationData, isInitFetching } = usePaginatedDeviceListData({
		search: debouncedSearchString,
		isSorted,
	});

	const table = useReactTable({
		data,
		columns,
		state: { columnVisibility },
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		columnResizeMode: 'onChange', // to make columns resizable
	});

	return (
		<>
			<div className="flex items-center justify-between gap-4">
				<Skeleton isLoading={isInitFetching} className="w-[95vw] h-8 rounded-md">
					<Input
						placeholder="Search by name..."
						value={searchString}
						onChange={event => setSearchString(event.target.value)}
						className="max-w-sm"
					/>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setIsSorted(prevState => !prevState)}
						className="hover:border-transparent"
					>
						{isSorted ? 'Disable sorting' : 'Enable sorting'}
					</Button>
					<ColumnManager columns={table.getAllColumns()} />
				</Skeleton>
			</div>
			<div className="rounded-md border">
				<Skeleton isLoading={isInitFetching} className="w-[95vw] h-[568px] rounded-md">
					<Table className="w-[95vw]">
						<TableHeader>
							{table.getHeaderGroups().map(headerGroup => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header, index) => {
										const width = header.getSize();
										return (
											<TableHead
												key={header.id}
												style={{ width }}
												className="relative border border-gray-100 border-x-1 border-y-0"
											>
												{header.isPlaceholder
													? null
													: flexRender(header.column.columnDef.header, header.getContext())}
												{index < headerGroup.headers.length - 1 && (
													<div
														onMouseDown={header.getResizeHandler()}
														className="absolute top-0 -right-[2px] h-full w-[4px] bg-gray-transparent cursor-col-resize select-none touch-none hover:bg-gray-300 transition-colors"
													/>
												)}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map(row => (
									<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
										{row.getVisibleCells().map(cell => (
											<TableCell key={cell.id} className="border border-gray-100">
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
			<Pagination paginationData={paginationData} isLoading={isInitFetching} />
		</>
	);
}
