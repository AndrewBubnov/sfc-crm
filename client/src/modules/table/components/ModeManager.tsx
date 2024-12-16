import { DeviceMode, DeviceState } from '@/types.ts';
import { useRef } from 'react';
import { useManageMode } from '@/modules/table/hooks/useManageMode.ts';
import { LoaderButton } from '@/modules/shared/components/LoaderButton.tsx';

type ModeMangerProps = {
	deviceId: string;
	state: DeviceState;
};

export const ModeManger = ({ deviceId, state }: ModeMangerProps) => {
	const deviceMode = useRef<DeviceMode | null>(null);

	const { mutate, isPending } = useManageMode(deviceMode);

	const modeHandler = (mode: DeviceMode) => async () => {
		deviceMode.current = mode;
		mutate({ deviceId, mode });
	};

	return (
		<div className="flex" defaultValue="off">
			{Object.values(DeviceMode).map(mode => {
				const isLoading = isPending && mode === deviceMode.current;
				return (
					<LoaderButton
						key={mode}
						isLoading={isLoading}
						disabled={isPending || mode === state}
						onClick={modeHandler(mode)}
						className="w-[100px]"
					>
						<span>{mode}</span>
					</LoaderButton>
				);
			})}
		</div>
	);
};
