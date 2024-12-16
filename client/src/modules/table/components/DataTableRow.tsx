import { TableCell, TableRow } from '@/ui/table.tsx';
import { flexRender, Row } from '@tanstack/react-table';

type DataTableRowProps<T> = {
	row: Row<T>;
};

export const DataTableRow = <T,>({ row }: DataTableRowProps<T>) => (
	<TableRow data-state={row.getIsSelected() && 'selected'}>
		{row.getVisibleCells().map(cell => (
			<TableCell key={cell.id} className="custom-table-cell">
				{flexRender(cell.column.columnDef.cell, cell.getContext())}
			</TableCell>
		))}
	</TableRow>
);
