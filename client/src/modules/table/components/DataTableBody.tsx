import { DataTableRow } from '@/modules/table/components/DataTableRow.tsx';
import { TableBody, TableCell, TableRow } from '@/ui/table.tsx';
import { columns } from '@/modules/table/columns.tsx';
import { Row } from '@tanstack/react-table';
import { Device } from '@/types.ts';

type DataTableRowProps = {
	rows?: Row<Device>[];
};

export const DataTableBody = ({ rows = [] }: DataTableRowProps) => (
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
