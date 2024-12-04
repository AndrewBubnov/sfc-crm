import { createContext } from 'react';
import { Table } from '@tanstack/react-table';
import { Device } from '@/types.ts';

export const TableContext = createContext<Table<Device>>({} as Table<Device>);
