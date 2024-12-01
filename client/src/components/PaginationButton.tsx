import { ReactNode } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils.ts';

type PaginationButtonProps = {
	children: ReactNode;
	disabled: boolean;
	className?: string;
	onClick?(): void;
	dataTestId?: string;
};

export const PaginationButton = ({ children, onClick, disabled, className, dataTestId }: PaginationButtonProps) => (
	<Button
		variant="ghost"
		size="sm"
		onClick={onClick}
		disabled={disabled}
		className={cn('hover:bg-transparent p-2', className)}
		data-testid={dataTestId}
	>
		{children}
	</Button>
);
