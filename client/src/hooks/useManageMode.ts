import { changeDeviceMode } from '@/api/changeDeviceMode.ts';
import { Device, DeviceMode } from '@/types.ts';
import { useToast } from '@/hooks/useToast.ts';
import { MutableRefObject, useCallback } from 'react';
import { useMutation } from '@/react-mini-query';

const COMMON_ERROR_DESCRIPTION = 'There was a problem with the device mode change';
const DEVICE_ERROR_DESCRIPTION = 'Device is in error state, needs to be restarted physically';

export const useManageMode = (deviceMode: MutableRefObject<DeviceMode | null>) => {
	const { toast } = useToast();

	const showSuccessToast = useCallback(
		(mode: DeviceMode, deviceId: string) =>
			toast({ title: `Device ${deviceId} mode has been successfully changed to '${mode}'` }),
		[toast]
	);
	const showErrorToast = useCallback(
		(description: string = COMMON_ERROR_DESCRIPTION) =>
			toast({
				variant: 'destructive',
				title: 'Uh oh! Something went wrong.',
				description,
			}),
		[toast]
	);

	return useMutation(changeDeviceMode, {
		onSuccess: (data: Record<'data', Device>, { mode, deviceId }) => {
			if (data.data.state !== 'error') {
				showSuccessToast(mode, deviceId);
				return;
			}
			showErrorToast(DEVICE_ERROR_DESCRIPTION);
		},
		onError: () => showErrorToast(),
		onSettled: () => {
			deviceMode.current = null;
		},
	});
};
