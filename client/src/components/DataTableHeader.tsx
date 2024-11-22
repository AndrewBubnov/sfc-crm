import { TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx';
import { flexRender, HeaderGroup } from '@tanstack/react-table';

type DataTableHeaderProps<T> = {
	headerGroups: HeaderGroup<T>[];
};

export const DataTableHeader = <T,>({ headerGroups }: DataTableHeaderProps<T>) => (
	<TableHeader>
		{headerGroups.map(headerGroup => (
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
);
