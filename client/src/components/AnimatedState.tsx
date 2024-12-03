import { useState } from 'react';
import { cn } from '@/lib/utils.ts';

type AnimatedStateProps = {
	text: string;
	className?: string;
	isError?: boolean;
	errorClassName?: string;
	onFocus?: () => void;
	onBlur?: () => void;
};

export const AnimatedState = ({ text, className, isError, errorClassName, onFocus, onBlur }: AnimatedStateProps) => {
	const [state, setState] = useState(text);

	const isStateChanged = state !== text;

	return (
		<div
			tabIndex={0}
			onFocus={onFocus}
			onBlur={onBlur}
			className="relative overflow-hidden h-5"
			data-testid="AnimatedState-container"
		>
			<div
				className={cn(
					'absolute',
					isStateChanged && 'flex flex-col -translate-y-1/2 transition-transform duration-300'
				)}
				onTransitionEnd={() => setState(text)}
			>
				<span
					className={cn(
						className,
						isStateChanged && 'opacity-0 transition-opacity',
						isError && errorClassName
					)}
				>
					{state}
				</span>
				{isStateChanged && <span className={className}>{text}</span>}
			</div>
		</div>
	);
};
