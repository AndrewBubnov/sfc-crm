import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { Button } from '@/components/ui/button.tsx';

type LimitManagerProps = {
	limit: number;
	onLimitChange: (limit: number) => void;
};

export const LimitManager = ({ limit, onLimitChange }: LimitManagerProps) => (
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
						onCheckedChange={() => onLimitChange(limitNumber)}
					>
						{limitNumber}
					</DropdownMenuCheckboxItem>
				);
			})}
		</DropdownMenuContent>
	</DropdownMenu>
);
