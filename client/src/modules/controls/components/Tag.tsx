import { cn } from '@/lib/utils.ts';
import { AnimationEvent } from 'react';
import { Button } from '@/ui/button.tsx';
import { X } from 'lucide-react';

type TagProps = {
	text: string;
	isDeleted: boolean;
	onDelete(): void;
	onAnimationEnd(evt: AnimationEvent<HTMLButtonElement>): void;
};

export const Tag = ({ text, isDeleted, onDelete, onAnimationEnd }: TagProps) => (
	<Button
		key={text}
		variant="outline"
		className={cn('h-7 p-2 hover:border-gray-200 -mb-0.5 animate-tag-mount', isDeleted && 'animate-tag-unmount')}
		onClick={onDelete}
		onAnimationEnd={onAnimationEnd}
	>
		<span>{text}</span>
		<X className="-mb-1" />
	</Button>
);
