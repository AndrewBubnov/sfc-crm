import { useContext } from 'react';
import { FilteringContext } from '@/providers/FilteringContext.ts';
import { Button } from '@/components/ui/button.tsx';
import { SearchX } from 'lucide-react';
import { initialFilters } from '@/constants.ts';

export const ClearFilters = () => {
	const { filters, setFilters } = useContext(FilteringContext);
	if (filters.some(filter => filter.search.length)) {
		return (
			<Button variant="ghost" onClick={() => setFilters(initialFilters)}>
				<SearchX />
				<span>Clear all filters:</span>
				<span className="text-gray-500">
					{filters
						.filter(filter => filter.search.length)
						.map(el => el.field)
						.join(', ')}
				</span>
			</Button>
		);
	}
	return null;
};
