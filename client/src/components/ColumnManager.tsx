import { Column } from '@tanstack/react-table';
import { Device } from '@/types.ts';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Settings2 as Settings } from 'lucide-react';

type ColumnManagerProps = {
	columns: Column<Device, unknown>[];
};

export const ColumnManager = ({ columns }: ColumnManagerProps) => (
	<DropdownMenu>
		<DropdownMenuTrigger asChild>
			<Button variant="ghost">
				<Settings />
				Edit columns
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent align="end">
			{columns
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
