import { DataTableRow } from '@/modules/table/components/DataTableRow.tsx';
import { TableBody, TableCell, TableRow } from '@/ui/table.tsx';
import { columns } from '@/modules/table/columns.tsx';
import { Row } from '@tanstack/react-table';

type DataTableRowProps<T> = {
	rows?: Row<T>[];
};

export const DataTableBody = <T,>({ rows = [] }: DataTableRowProps<T>) => (
	<TableBody>
		{rows?.length ? (
			rows.map(row => <DataTableRow key={row.id} row={row} />)
		) : (
			<TableRow>
				<TableCell colSpan={columns.length} className="h-24 text-center">
					No results.
				</TableCell>
			</TableRow>
		)}
	</TableBody>
);
