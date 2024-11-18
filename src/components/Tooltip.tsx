import { ReactNode } from 'react';
import { TooltipProvider, Tooltip as ShadCnTooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip.tsx';

type TooltipProps = {
	children: ReactNode;
	text: string;
};

export const Tooltip = ({ children, text }: TooltipProps) => (
	<TooltipProvider>
		<ShadCnTooltip>
			<TooltipTrigger asChild className="bg-transparent w-full font-normal p-0 border-none hover:border-none">
				{children}
			</TooltipTrigger>
			<TooltipContent>
				<p>{text}</p>
			</TooltipContent>
		</ShadCnTooltip>
	</TooltipProvider>
);
