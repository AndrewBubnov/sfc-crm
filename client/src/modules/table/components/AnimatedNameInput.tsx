import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import { Input } from '@/ui/input.tsx';
import { renameDevice } from '@/modules/table/api/renameDevice.ts';
import { useToast } from '@/modules/shared/hooks/useToast.ts';
import { ToastAction } from '@/ui/toast.tsx';
import { useMutation } from '@tanstack/react-query';
import { AnimatedState } from '@/modules/table/components/AnimatedState.tsx';

type CellInputProps = {
	deviceId: string;
	cellName: string;
};

export const AnimatedNameInput = ({ deviceId, cellName }: CellInputProps) => {
	const [focus, setFocus] = useState<boolean>(false);
	const [name, setName] = useState<string>(cellName);
	const { mutate } = useMutation({
		mutationFn: renameDevice,
	});

	const { toast } = useToast();

	useEffect(() => setName(cellName), [cellName]);

	const renameHandler = async (evt: FormEvent) => {
		evt.preventDefault();
		setFocus(false);
		if (!name.length || name === cellName) return;
		mutate(
			{ deviceId, name },
			{
				onSuccess: () => toast({ title: 'Device name has been successfully changed' }),
				onError: () =>
					toast({
						variant: 'destructive',
						title: 'Uh oh! Something went wrong.',
						description: 'There was a problem with renaming the device',
						action: (
							<ToastAction altText="Try again" onClick={renameHandler}>
								Try again
							</ToastAction>
						),
					}),
			}
		);
	};

	const onFocus = useCallback(() => setFocus(true), []);
	const onBlur = useCallback(() => setFocus(false), []);
	const onChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => setName(evt.target.value), []);
	const onCreateInput = useCallback((node: HTMLInputElement | null) => node?.focus(), []);

	return focus ? (
		<form onSubmit={renameHandler} role="form" onFocus={onFocus} onBlur={renameHandler}>
			<Input ref={onCreateInput} className="border-none shadow-none pl-0" value={name} onChange={onChange} />
		</form>
	) : (
		<AnimatedState text={name} onFocus={onFocus} onBlur={onBlur} />
	);
};
