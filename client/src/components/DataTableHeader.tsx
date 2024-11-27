import { MouseEvent, useContext } from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx';
import { flexRender, HeaderGroup } from '@tanstack/react-table';
import { ColumnFilter } from '@/components/ColumnFilter.tsx';
import { SortSwitch } from '@/components/SortSwitch.tsx';
import { FilteringContext } from '@/providers/FilteringContext.ts';

type DataTableHeaderProps<T> = {
	headerGroups: HeaderGroup<T>[];
	sortBy: string;
	sortDesc: boolean;
	onSortChange(arg: { sortedBy: string; sortedDesc: boolean }): void;
};

export const DataTableHeader = <T,>({ headerGroups, onSortChange, sortBy, sortDesc }: DataTableHeaderProps<T>) => {
	const { filters, onFilterChange } = useContext(FilteringContext);

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
							onFilterChange({ field: header.id, search: '' });
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
									{index < headerGroup.headers.length - 1 && (
										<>
											<div className="flex gap-4 items-center">
												<ColumnFilter
													isSearchEnabled={isSearchEnabled}
													value={filter?.search || ''}
													onOpenChange={onOpenChange}
													onChange={search => onFilterChange({ field: header.id, search })}
												/>
												<SortSwitch
													id={header.id}
													onSortChange={onSortChange}
													sortBy={sortBy}
													sortDesc={sortDesc}
												/>
											</div>
											<div
												onMouseDown={header.getResizeHandler()}
												className="absolute top-0 -right-[2px] h-full w-[4px] bg-gray-transparent cursor-col-resize select-none touch-none hover:bg-gray-300 transition-colors"
											/>
										</>
									)}
								</div>
							</TableHead>
						);
					})}
				</TableRow>
			))}
		</TableHeader>
	);
};
