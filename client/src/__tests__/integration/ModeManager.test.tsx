import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { ModeManger } from '@/modules/table/components/ModeManager.tsx';
import { DeviceState } from '@/types.ts';
import { ReactNode } from 'react';

vi.mock('axios');

describe('ModeManger', () => {
	const queryClient = new QueryClient();
	const defaultProps = {
		deviceId: 'test-device',
		state: 'off' as DeviceState,
	};

	const wrapper = ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);

	it('renders all device mode buttons', () => {
		render(<ModeManger {...defaultProps} />, { wrapper });

		expect(screen.getByText('off')).toBeInTheDocument();
		expect(screen.getByText('standby')).toBeInTheDocument();
		expect(screen.getByText('charging')).toBeInTheDocument();
	});

	it('calls changeDeviceMode with correct parameters', async () => {
		vi.mocked(axios.put).mockResolvedValue({ data: {} });

		render(<ModeManger {...defaultProps} />, { wrapper });

		const standbyButton = screen.getByText('standby');
		fireEvent.click(standbyButton);

		await waitFor(() => {
			expect(axios.put).toHaveBeenCalledWith(expect.stringContaining('/devices/test-device/change_mode'), {
				mode: 'standby',
			});
		});
	});

	it('disables current state button', () => {
		render(<ModeManger {...defaultProps} />, { wrapper });
		const offButton = screen.getByRole('button', { name: 'off' });
		expect(offButton).toBeDisabled();
	});

	it('disables buttons during API call', async () => {
		vi.mocked(axios.put).mockImplementation(() => new Promise(() => {}));

		render(<ModeManger {...defaultProps} />, { wrapper });

		const chargingButton = screen.getByRole('button', { name: 'charging' });
		fireEvent.click(chargingButton);

		await waitFor(() => {
			expect(chargingButton).toBeDisabled();
		});
	});
});
