import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils.ts';

type LoaderButtonProps = {
	isLoading: boolean;
	children: ReactNode;
	disabled?: boolean;
	onClick?(): void;
	className?: string;
};

export const LoaderButton = ({ children, isLoading, disabled, onClick, className }: LoaderButtonProps) => (
	<Button disabled={disabled} variant="ghost" className={cn('font-normal', className)} onClick={onClick}>
		{!isLoading && children}
		{isLoading && <Loader className="animate-spin" />}
	</Button>
);
