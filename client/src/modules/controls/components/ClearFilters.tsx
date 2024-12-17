import { Button } from '@/ui/button.tsx';
import { SearchX } from 'lucide-react';
import { useManageSearchParams } from '@/modules/shared/hooks/useManageSearchParams.ts';

export const ClearFilters = () => {
	const { filters, resetFilters } = useManageSearchParams();
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
