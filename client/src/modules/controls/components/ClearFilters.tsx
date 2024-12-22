import { useContext, useState, AnimationEvent } from 'react';
import { SearchParamsContext } from '@/providers/SearchParamsContext.ts';
import { Button } from '@/ui/button.tsx';
import { SearchX, X } from 'lucide-react';
import { cn } from '@/lib/utils.ts';
import { FilterField } from '@/types.ts';

export const ClearFilters = () => {
	const { filters, resetFilters, onFilterChange } = useContext(SearchParamsContext);

	const [deletedField, setDeletedField] = useState<string>('');

	const onTransitionEnd = (field: FilterField) => (evt: AnimationEvent<HTMLButtonElement>) => {
		if (evt.target === evt.currentTarget && deletedField) {
			onFilterChange({ field, search: '' });
			setDeletedField('');
		}
	};

	if (filters.some(filter => filter.search.length)) {
		return (
			<div className="flex items-center">
				<Button variant="ghost" onClick={resetFilters} className="hover:bg-transparent">
					<SearchX />
					<span>Clear all filters:</span>
				</Button>
				<div className="flex items-center gap-1">
					{filters
						.filter(filter => filter.search.length)
						.map(el => el.field)
						.map(field => (
							<Button
								key={field}
								variant="outline"
								className={cn(
									'text-gray-500 h-7 p-2 hover:border-gray-200 -mb-0.5 animate-tag-mount',
									field === deletedField && 'animate-tag-unmount'
								)}
								onClick={() => setDeletedField(field)}
								onAnimationEnd={onTransitionEnd(field)}
							>
								{field} <X className="-mb-1" />
							</Button>
						))}
				</div>
			</div>
		);
	}
	return null;
};
