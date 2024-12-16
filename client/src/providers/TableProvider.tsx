import { TableContext } from '@/providers/TableContext.ts';
import { ReactNode, useState } from 'react';
import { getCoreRowModel, RowSelectionState, useReactTable, VisibilityState } from '@tanstack/react-table';
import { animatedColumns, columns } from '@/modules/table/columns.tsx';
import { useData } from '@/modules/shared/hooks/useData.ts';

type TableProviderProps = {
	children: ReactNode;
};

export const TableProvider = ({ children }: TableProviderProps) => {
	const { data } = useData();
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [isAnimated, setIsAnimated] = useState<boolean>(false);

	const table = useReactTable({
		data,
		columns: isAnimated ? animatedColumns : columns,
		state: { columnVisibility, rowSelection },
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		columnResizeMode: 'onChange',
		onRowSelectionChange: setRowSelection,
	});
	return <TableContext.Provider value={{ table, isAnimated, setIsAnimated }}>{children}</TableContext.Provider>;
};
