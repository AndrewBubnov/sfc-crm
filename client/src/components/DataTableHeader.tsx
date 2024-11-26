import { MouseEvent } from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx';
import { flexRender, HeaderGroup } from '@tanstack/react-table';
import { ColumnFilter } from '@/components/ColumnFilter.tsx';
import { SortSwitch } from '@/components/SortSwitch.tsx';

type DataTableHeaderProps<T> = {
	headerGroups: HeaderGroup<T>[];
	searchString: string;
	onFilterChange({ search, field }: { search: string; field: string }): void;
	sortBy: string;
	sortDesc: boolean;
	searchField: string;
	onSortChange(arg: { sortedBy: string; sortedDesc: boolean }): void;
};

export const DataTableHeader = <T,>({
	headerGroups,
	searchString,
	onFilterChange,
	onSortChange,
	sortBy,
	sortDesc,
	searchField,
}: DataTableHeaderProps<T>) => (
	<TableHeader>
		{headerGroups.map(headerGroup => (
			<TableRow key={headerGroup.id}>
				{headerGroup.headers.map((header, index) => {
					const width = header.getSize();
					const isSearchEnabled = searchField === header.id && Boolean(searchString.length);
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
												value={searchString}
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
