import { Button } from '@/components/ui/button.tsx';
import { DeviceMode, DeviceState } from '@/types.ts';
import { changeDeviceMode } from '@/api/changeDeviceMode.ts';
import { useToast } from '@/hooks/useToast.ts';
import { useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Tooltip } from '@/components/Tooltip.tsx';
import { useMutation } from '@tanstack/react-query';

type ModeMangerProps = {
	deviceId: string;
	state: DeviceState;
};

export const ModeManger = ({ deviceId, state }: ModeMangerProps) => {
	const { mutate, isPending } = useMutation({
		mutationFn: changeDeviceMode,
	});

	const { toast } = useToast();

	const deviceMode = useRef<DeviceMode | null>(null);

	const modeHandler = (mode: DeviceMode) => async () => {
		deviceMode.current = mode;
		mutate(
			{ deviceId, mode },
			{
				onSuccess: () => toast({ title: `Device ${deviceId} mode has been successfully changed to '${mode}'` }),
				onError: () =>
					toast({
						variant: 'destructive',
						title: 'Uh oh! Something went wrong.',
						description: 'There was a problem with the device mode change',
					}),
				onSettled: () => {
					deviceMode.current = null;
				},
			}
		);
	};

	return (
		<div className="flex" defaultValue="off">
			{Object.values(DeviceMode).map(mode => (
				<Tooltip key={mode} text={`Click to change mode to '${mode}'`}>
					<Button
						disabled={isPending || mode === state}
						variant="ghost"
						className="bg-transparent w-[100px] font-normal border-none hover:border-none"
						onClick={modeHandler(mode)}
					>
						{isPending && mode === deviceMode.current && <Loader2 className="animate-spin mt-0.5" />}
						{mode}
					</Button>
				</Tooltip>
			))}
		</div>
	);
};
