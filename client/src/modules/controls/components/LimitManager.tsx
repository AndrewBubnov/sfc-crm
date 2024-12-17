import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/ui/dropdown-menu.tsx';
import { Button } from '@/ui/button.tsx';
import { Skeleton } from '@/modules/shared/components/Skeleton.tsx';
import { useManageSearchParams } from '@/modules/shared/hooks/useManageSearchParams.ts';
import { useGetQueryDetails } from '@/modules/shared/hooks/useGetQueryDetails.ts';

export const LimitManager = () => {
	const { isInitFetching } = useGetQueryDetails();
	const { limit, onLimitChange } = useManageSearchParams();

	return (
		<Skeleton isLoading={isInitFetching} className="w-[15vw] h-8 rounded-md">
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
					{[10, 20].map(limitNumber => {
						return (
							<DropdownMenuCheckboxItem
								key={limitNumber}
								checked={limitNumber === limit}
								onCheckedChange={() => onLimitChange(limitNumber)}
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
