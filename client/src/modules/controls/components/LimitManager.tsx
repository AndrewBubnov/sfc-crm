import { useContext } from 'react';
import { SearchParamsContext } from '@/providers/SearchParamsContext.ts';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/ui/dropdown-menu.tsx';
import { Button } from '@/ui/button.tsx';
import { LINES_PER_PAGE_VARIANTS } from '@/modules/controls/constants.ts';

export const LimitManager = () => {
	const { limit, onLimitChange } = useContext(SearchParamsContext);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="bg-transparent text-sm hover:bg-transparent hover:border-transparent"
				>
					Lines per page: {limit}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{LINES_PER_PAGE_VARIANTS.map(limitNumber => {
					return (
						<DropdownMenuCheckboxItem
							key={limitNumber}
							checked={limitNumber === limit}
							onCheckedChange={onLimitChange.bind(null, limitNumber)}
						>
							{limitNumber}
						</DropdownMenuCheckboxItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
