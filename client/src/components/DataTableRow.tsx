import { TableCell, TableRow } from '@/components/ui/table.tsx';
import { flexRender, Row } from '@tanstack/react-table';
import { Device } from '@/types.ts';

type DataTableRowProps = {
	row: Row<Device>;
};

export const DataTableRow = ({ row }: DataTableRowProps) => (
	<TableRow data-state={row.getIsSelected() && 'selected'}>
		{row.getVisibleCells().map(cell => (
			<TableCell key={cell.id} className="custom-table-cell">
				{flexRender(cell.column.columnDef.cell, cell.getContext())}
			</TableCell>
		))}
	</TableRow>
);
