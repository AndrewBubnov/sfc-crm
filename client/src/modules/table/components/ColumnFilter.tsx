import { MouseEvent } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover.tsx';
import { Search } from 'lucide-react';
import { SearchInput } from '@/modules/table/components/SearchInput.tsx';
import { cn } from '@/lib/utils.ts';

type ColumnFilterProps = {
	value: string;
	onChange(value: string): void;
	onOpenChange(evt: MouseEvent): void;
	isSearchEnabled: boolean;
};

export const ColumnFilter = ({ value, onChange, onOpenChange, isSearchEnabled }: ColumnFilterProps) => (
	<Popover>
		<PopoverTrigger
			className="bg-transparent border-none hover:border-none focus:outline-none"
			onClick={onOpenChange}
		>
			<Search
				size={16}
				className={cn(
					'opacity-20 cursor-pointer hover:opacity-100 transition hover:duration-300',
					isSearchEnabled && 'opacity-100'
				)}
			/>
		</PopoverTrigger>
		<PopoverContent side="top">
			<SearchInput value={value} onChange={evt => onChange(evt.target.value)} />
		</PopoverContent>
	</Popover>
);
