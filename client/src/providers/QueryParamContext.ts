import { createContext } from 'react';
import { Filter, Sort } from '@/types.ts';

type QueryParamContextProps = {
	page: number;
	paramsList: string[][];
	setParams(arg: string[][]): void;
	onFilterChange(filter: Filter): void;
	resetFilters(): void;
	filters: Filter[];
	sort: Sort;
	limit: number;
	onLimitChange(arg: number): void;
	onSortChange(arg: Sort): void;
};

export const QueryParamContext = createContext<QueryParamContextProps>({} as QueryParamContextProps);
