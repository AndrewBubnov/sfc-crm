import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Skeleton } from '@/components/Skeleton.tsx';
import { useContext } from 'react';
import { PaginatedDataContext } from '@/providers/PaginatedDataContext.ts';

export const LimitManager = () => {
	const {
		paginationData: { limit, onChangeLimit },
		isInitFetching,
	} = useContext(PaginatedDataContext);

	return (
		<Skeleton isLoading={isInitFetching} className="w-[15vw] h-8 rounded-md">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="ml-auto bg-transparent text-sm hover:bg-transparent hover:border-transparent"
					>
						Lines per page: {limit}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					{[10, 20].map(limitNumber => {
						return (
							<DropdownMenuCheckboxItem
								key={limitNumber}
								checked={limitNumber === limit}
								onCheckedChange={() => onChangeLimit(limitNumber)}
							>
								{limitNumber}
							</DropdownMenuCheckboxItem>
						);
					})}
				</DropdownMenuContent>
			</DropdownMenu>
		</Skeleton>
	);
};
