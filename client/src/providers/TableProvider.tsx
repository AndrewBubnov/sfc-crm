import { TableContext } from '@/providers/TableContext.ts';
import { ReactNode, useContext, useState } from 'react';
import { PaginatedDataContext } from '@/providers/PaginatedDataContext.ts';
import { getCoreRowModel, RowSelectionState, useReactTable, VisibilityState } from '@tanstack/react-table';
import { columns } from '@/columns.tsx';

type TableProviderProps = {
	children: ReactNode;
};

export const TableProvider = ({ children }: TableProviderProps) => {
	const { data } = useContext(PaginatedDataContext);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

	const table = useReactTable({
		data,
		columns,
		state: { columnVisibility, rowSelection },
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		columnResizeMode: 'onChange',
		onRowSelectionChange: setRowSelection,
	});
	return <TableContext.Provider value={table}>{children}</TableContext.Provider>;
};
