import z from 'zod';
import { DeviceMode, DeviceType } from '@/types.ts';

export const registerDeviceSchema = z
	.object({
		autoNameGenerate: z.boolean(),
		name: z
			.string()
			.optional()
			.refine(value => !value || (value.trim().length >= 3 && value.trim().length <= 18), {
				message: 'Name must be between 3 and 18 characters',
			}),
		type: z.nativeEnum(DeviceType),
		state: z.nativeEnum(DeviceMode),
	})
	.refine(data => data.autoNameGenerate || (data.name && data.name.trim().length > 0), {
		message: 'If auto name generation is off, name field is required',
		path: ['name'],
	});

export type RegisterDeviceSchemaType = z.infer<typeof registerDeviceSchema>;
