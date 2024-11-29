import { Button } from '@/components/ui/button.tsx';
import { DeviceMode, DeviceState } from '@/types.ts';
import { useRef } from 'react';
import { Loader } from 'lucide-react';
import { Tooltip } from '@/components/Tooltip.tsx';
import { useManageMode } from '@/hooks/useManageMode.ts';

type ModeMangerProps = {
	deviceId: string;
	state: DeviceState;
};

export const ModeManger = ({ deviceId, state }: ModeMangerProps) => {
	const deviceMode = useRef<DeviceMode | null>(null);

	const { mutate, isLoading } = useManageMode(deviceMode);

	const modeHandler = (mode: DeviceMode) => async () => {
		deviceMode.current = mode;
		mutate({ deviceId, mode });
	};

	return (
		<div className="flex" defaultValue="off">
			{Object.values(DeviceMode).map(mode => {
				const isPending = isLoading && mode === deviceMode.current;
				return (
					<Tooltip key={mode} text={`Click to change mode to '${mode}'`}>
						<Button
							disabled={isLoading || mode === state}
							variant="ghost"
							className="bg-transparent w-[100px] font-normal border-none hover:border-none"
							onClick={modeHandler(mode)}
						>
							{!isPending && <span>{mode}</span>}
							{isPending && <Loader className="animate-spin" />}
						</Button>
					</Tooltip>
				);
			})}
		</div>
	);
};
