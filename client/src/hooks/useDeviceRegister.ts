import { registerDevice } from '@/api/registerDevice.ts';
import { useMutation, useQueryClient } from '@/react-mini-query';

export const useDeviceRegister = () => {
	const queryClient = useQueryClient();
	return useMutation(registerDevice, {
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['devices'] }),
	}).mutate;
};
