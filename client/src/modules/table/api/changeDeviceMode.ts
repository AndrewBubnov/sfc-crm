import { DeviceMode } from '@/types.ts';
import axios from 'axios';
import { BASE_URL } from '@/modules/shared/constants.ts';

type RenameDevice = {
	deviceId: string;
	mode: DeviceMode;
};

export const changeDeviceMode = async ({ deviceId, mode }: RenameDevice) =>
	axios.put(`${BASE_URL}/devices/${deviceId}/change_mode`, { mode });
