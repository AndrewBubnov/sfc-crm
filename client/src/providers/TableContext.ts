import { createContext } from 'react';
import { Table } from '@tanstack/react-table';
import { Device } from '@/types.ts';

type TableContextProps = {
	table: Table<Device>;
};

export const TableContext = createContext<TableContextProps>({} as TableContextProps);
