import { useContext } from 'react';
import { QueryParamContext } from '@/providers/QueryParamContext.ts';
import { ArrowUpAZ } from 'lucide-react';
import { ArrowDownAZ } from 'lucide-react';
import { cn } from '@/lib/utils.ts';

type SortSwitchProps = {
	id: string;
	sortBy: string;
	sortDesc: boolean;
};

export const SortSwitch = ({ id, sortBy, sortDesc }: SortSwitchProps) => {
	const { onSortChange } = useContext(QueryParamContext);

	const upSortHandler = () => onSortChange({ sortBy: id, sortDesc: false });

	const downSortHandler = () => onSortChange({ sortBy: id, sortDesc: true });

	return (
		<div className="flex items-center gap-4">
			<ArrowUpAZ
				size={16}
				onClick={upSortHandler}
				className={cn(
					'opacity-20 cursor-pointer hover:opacity-100 transition hover:duration-300',
					id === sortBy && !sortDesc && 'opacity-100'
				)}
				data-testid="sort-switch-asc"
			/>
			<ArrowDownAZ
				size={16}
				onClick={downSortHandler}
				className={cn(
					'opacity-20 cursor-pointer hover:opacity-100 transition hover:duration-300',
					id === sortBy && sortDesc && 'opacity-100'
				)}
				data-testid="sort-switch-desc"
			/>
		</div>
	);
};
