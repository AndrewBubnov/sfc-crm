import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerDevice } from '@/api/registerDevice.ts';

export const useDeviceRegister = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: registerDevice,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['devices'] });
		},
	}).mutate;
};
