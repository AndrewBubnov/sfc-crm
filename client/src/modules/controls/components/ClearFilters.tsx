import { useContext, useState, AnimationEvent, useEffect } from 'react';
import { SearchParamsContext } from '@/providers/SearchParamsContext.ts';
import { Button } from '@/ui/button.tsx';
import { SearchX } from 'lucide-react';
import { FilterField } from '@/types.ts';
import { Tag } from '@/modules/controls/components/Tag.tsx';

export const ClearFilters = () => {
	const { filters, resetFilters, onFilterChange } = useContext(SearchParamsContext);
	const [fields, setFields] = useState<FilterField[]>([]);
	const [deletedField, setDeletedField] = useState<string>('');

	useEffect(() => {
		if (filters.length > fields.length && filters.every(filter => filter.search.length)) {
			setFields(filters.map(el => el.field));
			return;
		}
		if (filters.length < fields.length) {
			const filterFields = filters.map(el => el.field);
			setDeletedField(fields.find(el => !filterFields.includes(el)) || '');
		}
	}, [fields, filters]);

	const onAnimationEnd = (field: FilterField) => (evt: AnimationEvent<HTMLButtonElement>) => {
		if (evt.target === evt.currentTarget && deletedField) {
			onFilterChange({ field, search: '' });
			setFields(prevState => prevState.filter(el => el !== field));
			setDeletedField('');
		}
	};

	return fields.length ? (
		<div className="flex items-center">
			<Button variant="ghost" onClick={resetFilters} className="hover:bg-transparent">
				<SearchX />
				<span>Clear all filters</span>
			</Button>
			<div className="flex items-center gap-1">
				{fields.map(field => (
					<Tag
						key={field}
						text={field}
						isDeleted={field === deletedField}
						onDelete={() => setDeletedField(field)}
						onAnimationEnd={onAnimationEnd(field)}
					/>
				))}
			</div>
		</div>
	) : null;
};
