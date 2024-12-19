import { TableCell, TableRow } from '@/ui/table.tsx';
import { flexRender, Row } from '@tanstack/react-table';
import { useContext } from 'react';
import { TableContext } from '@/providers/TableContext.ts';
import { useIsMutating } from '@tanstack/react-query';
import { MutationKeys } from '@/modules/shared/queryKeys.ts';
import { Device } from '@/types.ts';
import { cn } from '@/lib/utils.ts';

type DataTableRowProps = {
	row: Row<Device>;
};

export const DataTableRow = ({ row }: DataTableRowProps) => {
	const { deletedIdsList } = useContext(TableContext);
	const isMutating = Boolean(useIsMutating({ mutationKey: [MutationKeys.Delete] }));
	const isDeleting = isMutating && deletedIdsList.includes(row.original.id);
	return (
		<TableRow
			data-state={row.getIsSelected() && 'selected'}
			className={cn(isDeleting && 'opacity-35 pointer-events-none')}
			onClick={row.getToggleSelectedHandler()}
		>
			{row.getVisibleCells().map(cell => (
				<TableCell key={cell.id} className="custom-table-cell">
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</TableCell>
			))}
		</TableRow>
	);
};
