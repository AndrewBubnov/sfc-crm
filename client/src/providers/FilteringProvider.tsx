import { ReactNode, useCallback, useMemo, useState } from 'react';
import { FilteringContext } from '@/providers/FilteringContext.ts';
import { initialFilters } from '@/constants.ts';
import { Filter } from '@/types.ts';

type FilteringProviderProps = {
	children: ReactNode;
};

export const FilteringProvider = ({ children }: FilteringProviderProps) => {
	const [filters, setFilters] = useState<Filter[]>(initialFilters);
	const onFilterChange = useCallback(
		({ search, field }: Filter) =>
			setFilters(prevState =>
				prevState.map(el => {
					if (el.field === field) return { search, field };
					return el;
				})
			),
		[]
	);

	const value = useMemo(
		() => ({
			filters,
			setFilters,
			onFilterChange,
		}),
		[filters, onFilterChange]
	);

	return <FilteringContext.Provider value={value}>{children}</FilteringContext.Provider>;
};
