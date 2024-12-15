import { Button } from '@/components/ui/button.tsx';
import { SearchX } from 'lucide-react';
import { useQueryParams } from '@/hooks/useQueryParams.ts';

export const ClearFilters = () => {
	const { filters, resetFilters } = useQueryParams();
	if (filters.some(filter => filter.search.length)) {
		return (
			<Button variant="ghost" onClick={resetFilters}>
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
