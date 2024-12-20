import { ReactNode, useState } from 'react';
import { TableContext } from '@/providers/TableContext.ts';
import { getCoreRowModel, RowSelectionState, useReactTable, VisibilityState } from '@tanstack/react-table';
import { useData } from '@/modules/table/hooks/useData.ts';
import { animatedColumns, columns } from '@/modules/table/columns.tsx';

type TableProviderProps = {
	children: ReactNode;
};

export const TableProvider = ({ children }: TableProviderProps) => {
	const { data } = useData();
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [deletedIdsList, setDeletedIdsList] = useState<string[]>([]);
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
	return (
		<TableContext.Provider value={{ table, isAnimated, setIsAnimated, deletedIdsList, setDeletedIdsList }}>
			{children}
		</TableContext.Provider>
	);
};
