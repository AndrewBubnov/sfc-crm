import { createContext, Dispatch, SetStateAction } from 'react';
import { Table } from '@tanstack/react-table';
import { Device } from '@/types.ts';

type TableContextProps = {
	table: Table<Device>;
	isAnimated: boolean;
	setIsAnimated: Dispatch<SetStateAction<boolean>>;
};

export const TableContext = createContext<TableContextProps>({} as TableContextProps);
