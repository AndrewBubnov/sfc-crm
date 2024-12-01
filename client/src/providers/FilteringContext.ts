import { createContext, Dispatch, SetStateAction } from 'react';
import { Filter } from '@/types.ts';

type FilteringContextProps = {
	filters: Filter[];
	setFilters: Dispatch<SetStateAction<Filter[]>>;
	onFilterChange(arg: Filter): void;
};

export const FilteringContext = createContext<FilteringContextProps>({} as FilteringContextProps);
