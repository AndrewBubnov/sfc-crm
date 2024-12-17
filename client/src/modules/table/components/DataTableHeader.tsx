import { MouseEvent } from 'react';
import { TableHead, TableHeader, TableRow } from '@/ui/table.tsx';
import { flexRender, HeaderGroup } from '@tanstack/react-table';
import { ColumnFilter } from '@/modules/table/components/ColumnFilter.tsx';
import { SortSwitch } from '@/modules/table/components/SortSwitch.tsx';
import { useManageSearchParams } from '@/modules/shared/hooks/useManageSearchParams.ts';
import { FilterField } from '@/types.ts';

type DataTableHeaderProps<T> = {
	headerGroups: HeaderGroup<T>[];
};

export const DataTableHeader = <T,>({ headerGroups }: DataTableHeaderProps<T>) => {
	const { setFilter, filters, sort } = useManageSearchParams();

	return (
		<TableHeader>
			{headerGroups.map(headerGroup => (
				<TableRow key={headerGroup.id}>
					{headerGroup.headers.map((header, index) => {
						const width = header.getSize();
						const filter = filters.find(el => el.field === header.id);
						const isSearchEnabled = Boolean(filter) && Boolean(filter?.search.length);
						const onOpenChange = (evt: MouseEvent) => {
							if (isSearchEnabled) evt.preventDefault();
							setFilter({ field: header.id as FilterField, search: '' });
						};
						return (
							<TableHead
								key={header.id}
								style={{ width }}
								className="relative border border-gray-100 border-x-1 border-y-0"
							>
								<div className="flex justify-between items-center">
									{header.isPlaceholder
										? null
										: flexRender(header.column.columnDef.header, header.getContext())}
									{index && index < headerGroup.headers.length - 1 ? (
										<>
											<div className="flex gap-4 items-center">
												<ColumnFilter
													isSearchEnabled={isSearchEnabled}
													value={filter?.search || ''}
													onOpenChange={onOpenChange}
													onChange={search =>
														setFilter({ field: header.id as FilterField, search })
													}
												/>
												<SortSwitch
													id={header.id}
													sortBy={sort.sortBy}
													sortDesc={sort.sortDesc}
												/>
											</div>
											<div
												onMouseDown={header.getResizeHandler()}
												className="absolute top-0 -right-[2px] h-full w-[4px] bg-gray-transparent cursor-col-resize select-none touch-none hover:bg-gray-300 transition-colors"
											/>
										</>
									) : null}
								</div>
							</TableHead>
						);
					})}
				</TableRow>
			))}
		</TableHeader>
	);
};
