import { createContext } from 'react';
import { Filter } from '@/types.ts';

type FilteringContextProps = {
	filters: Filter[];
	onFilterChange(arg: Filter): void;
};

export const FilteringContext = createContext<FilteringContextProps>({} as FilteringContextProps);
