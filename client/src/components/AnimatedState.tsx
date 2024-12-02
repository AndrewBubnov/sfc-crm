import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils.ts';

type AnimatedStateProps = {
	id: string;
	text: string;
};

export const AnimatedState = ({ text, id }: AnimatedStateProps) => {
	const [isStateChanged, setIsStateChanged] = useState(false);
	const [prevText, setPrevText] = useState(text);

	const idRef = useRef(id);

	useEffect(() => {
		if (text !== prevText && id === idRef.current) {
			setIsStateChanged(true);
		}
		if (id !== idRef.current) {
			setIsStateChanged(false);
			idRef.current = id;
		}
	}, [id, prevText, text]);

	const onTransitionEnd = () => {
		setIsStateChanged(false);
		setPrevText(text);
	};

	return (
		<div className="relative overflow-hidden h-5">
			<div
				className={cn(
					'absolute top-0 left-0',
					isStateChanged && 'flex flex-col -translate-y-1/2 transition-transform duration-300'
				)}
				onTransitionEnd={onTransitionEnd}
			>
				<span
					className={cn(
						'font-semibold',
						prevText === 'error' && 'text-red-400',
						isStateChanged && 'opacity-0 transition-opacity'
					)}
				>
					{prevText}
				</span>
				{isStateChanged && (
					<span className={cn('font-semibold', text === 'error' && 'text-red-400')}>{text}</span>
				)}
			</div>
		</div>
	);
};
