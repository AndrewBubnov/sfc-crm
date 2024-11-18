import { BASE_URL } from '@/constants.ts';
import { DeviceMode } from '@/types.ts';
import axios from 'axios';

type RenameDevice = {
	deviceId: string;
	mode: DeviceMode;
};

export const changeDeviceMode = async ({ deviceId, mode }: RenameDevice) =>
	axios.put(`${BASE_URL}/devices/${deviceId}/change_mode`, { mode });
