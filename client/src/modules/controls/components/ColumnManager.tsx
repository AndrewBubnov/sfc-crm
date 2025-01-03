import { useContext } from 'react';
import { TableContext } from '@/providers/TableContext.ts';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/ui/dropdown-menu.tsx';
import { Button } from '@/ui/button.tsx';
import { Settings2 as Settings } from 'lucide-react';

export const ColumnManager = () => {
	const { table } = useContext(TableContext);
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost">
					<Settings />
					Edit columns
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{table
					.getAllColumns()
					.filter(column => column.getCanHide())
					.map(column => {
						return (
							<DropdownMenuCheckboxItem
								key={column.id}
								className="capitalize"
								checked={column.getIsVisible()}
								onCheckedChange={value => column.toggleVisibility(value)}
							>
								{column.id}
							</DropdownMenuCheckboxItem>
						);
					})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
