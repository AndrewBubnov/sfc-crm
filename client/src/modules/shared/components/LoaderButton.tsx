import { Loader } from 'lucide-react';
import { Button } from '@/ui/button.tsx';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils.ts';

type LoaderButtonProps = {
	isLoading: boolean;
	children: ReactNode;
	disabled?: boolean;
	onClick?(): void;
	className?: string;
	variant?: 'ghost' | 'default' | 'destructive' | 'outline' | 'secondary' | 'link' | null;
	type?: 'submit' | 'button';
};

export const LoaderButton = ({
	children,
	isLoading,
	disabled,
	onClick,
	className,
	variant = 'ghost',
	type = 'button',
}: LoaderButtonProps) => (
	<Button
		disabled={disabled}
		variant={variant}
		className={cn('font-normal', className)}
		onClick={onClick}
		type={type}
	>
		{!isLoading && children}
		{isLoading && <Loader className="animate-spin" />}
	</Button>
);
