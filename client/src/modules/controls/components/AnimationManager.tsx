import { useContext } from 'react';
import { TableContext } from '@/providers/TableContext.ts';
import { Checkbox } from '@/ui/checkbox.tsx';
import { Label } from '@/ui/label.tsx';

export const AnimationManager = () => {
	const { isAnimated, setIsAnimated } = useContext(TableContext);
	return (
		<Label className="flex items-center gap-2">
			<Checkbox
				className="checkbox-inverted"
				checked={isAnimated}
				onCheckedChange={evt => setIsAnimated(Boolean(evt))}
			/>
			Animated state
		</Label>
	);
};
