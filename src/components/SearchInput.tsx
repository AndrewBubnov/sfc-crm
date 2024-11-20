import { ComponentProps, forwardRef } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils.ts';

export const SearchInput = forwardRef<HTMLInputElement, ComponentProps<'input'>>(({ className, ...props }, ref) => {
	return (
		<div
			className={cn(
				'flex h-10 items-center rounded-md border border-input bg-white pl-3 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2',
				className
			)}
		>
			<Search size={16} />
			<input
				{...props}
				type="search"
				ref={ref}
				className="w-full p-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			/>
		</div>
	);
});
