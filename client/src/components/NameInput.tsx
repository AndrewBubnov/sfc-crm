import { FormEvent, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input.tsx';
import { renameDevice } from '@/api/renameDevice.ts';
import { useToast } from '@/hooks/useToast.ts';
import { ToastAction } from '@/components/ui/toast.tsx';
import { useMutation } from '@tanstack/react-query';

type CellInputProps = {
	deviceId: string;
	cellName: string;
};

export const NameInput = ({ deviceId, cellName }: CellInputProps) => {
	const [name, setName] = useState<string>(cellName);
	const { mutate, isPending } = useMutation({
		mutationFn: renameDevice,
	});
	const { toast } = useToast();

	useEffect(() => setName(cellName), [cellName]);

	const renameHandler = async (evt: FormEvent) => {
		evt.preventDefault();
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

	return (
		<form onSubmit={renameHandler} role="form">
			<Input
				disabled={isPending}
				onBlur={renameHandler}
				className="border-none shadow-none pl-0"
				value={name}
				onChange={e => setName(e.target.value)}
			/>
		</form>
	);
};
