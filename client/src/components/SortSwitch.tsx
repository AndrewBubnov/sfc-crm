import { ArrowUpAZ } from 'lucide-react';
import { ArrowDownAZ } from 'lucide-react';
import { cn } from '@/lib/utils.ts';

type SortSwitchProps = {
	id: string;
	sortBy: string;
	sortDesc: boolean;
	onSortChange(arg: { sortedBy: string; sortedDesc: boolean }): void;
};

export const SortSwitch = ({ id, sortBy, sortDesc, onSortChange }: SortSwitchProps) => {
	const upSortHandler = () => onSortChange({ sortedBy: id, sortedDesc: false });

	const downSortHandler = () => onSortChange({ sortedBy: id, sortedDesc: true });

	return (
		<div className="flex items-center justify-between">
			<p>{`${id.charAt(0).toUpperCase()}${id.slice(1)}`}</p>
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
		</div>
	);
};
