import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AnimatedNameInput } from '@/modules/table/components/AnimatedNameInput.tsx';
import { expect, Mock, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renameDevice } from '@/modules/table/api/renameDevice.ts';
import { ReactNode } from 'react';

const mockToast = vi.fn();

vi.mock('@/modules/shared/hooks/useToast.ts', () => ({
	useToast: () => ({
		toast: mockToast,
	}),
}));

vi.mock('@/modules/table/api/renameDevice.ts', () => ({
	renameDevice: vi.fn(),
}));

describe('AnimatedNameInput', () => {
	const mockRenameDevice = vi.fn();

	const defaultProps = {
		deviceId: '123',
		cellName: 'Old Device Name',
	};

	let queryClient: QueryClient;

	beforeEach(() => {
		vi.clearAllMocks();

		queryClient = new QueryClient({
			defaultOptions: {
				mutations: {
					retry: false,
				},
				queries: {
					retry: false,
				},
			},
		});

		(renameDevice as Mock).mockResolvedValue({ success: true });
	});

	const wrapper = ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);

	it('renders the input with the correct initial value', async () => {
		render(<AnimatedNameInput {...defaultProps} />, { wrapper });
		fireEvent.focus(screen.getByTestId('AnimatedState-container'));
		await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument());
		const inputElement = screen.getByRole('textbox');
		expect(inputElement).toHaveValue('Old Device Name');
	});

	it('updates the input value when typed into', async () => {
		render(<AnimatedNameInput {...defaultProps} />, { wrapper });
		fireEvent.focus(screen.getByTestId('AnimatedState-container'));
		await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument());
		const inputElement = screen.getByRole('textbox');
		fireEvent.change(inputElement, { target: { value: 'New Device Name' } });
		expect(inputElement).toHaveValue('New Device Name');
	});

	it('does not call mutate when the name is the same', async () => {
		render(<AnimatedNameInput {...defaultProps} />, { wrapper });
		fireEvent.focus(screen.getByTestId('AnimatedState-container'));
		await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument());
		const inputElement = screen.getByRole('textbox');
		fireEvent.change(inputElement, { target: { value: 'Old Device Name' } });

		await waitFor(() => expect(mockRenameDevice).not.toHaveBeenCalled());
	});

	it('calls mutate with the correct parameters when the name is changed', async () => {
		render(<AnimatedNameInput {...defaultProps} />, { wrapper });
		fireEvent.focus(screen.getByTestId('AnimatedState-container'));
		await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument());
		const inputElement = screen.getByRole('textbox');
		fireEvent.change(inputElement, { target: { value: 'New Device Name' } });
		fireEvent.submit(screen.getByRole('form'));

		await waitFor(() => {
			expect(renameDevice).toHaveBeenCalledTimes(1);
			expect(renameDevice).toHaveBeenCalledWith({
				deviceId: '123',
				name: 'New Device Name',
			});
		});
	});

	it('displays success toast on successful mutation', async () => {
		(renameDevice as Mock).mockResolvedValueOnce({});

		render(<AnimatedNameInput {...defaultProps} />, { wrapper });
		fireEvent.focus(screen.getByTestId('AnimatedState-container'));
		await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument());
		const inputElement = screen.getByRole('textbox');
		fireEvent.change(inputElement, { target: { value: 'New Device Name' } });
		fireEvent.submit(screen.getByRole('form'));

		await waitFor(() => {
			expect(mockToast).toHaveBeenCalledWith({
				title: 'Device name has been successfully changed',
			});
		});
	});

	it('displays error toast on failed mutation', async () => {
		(renameDevice as Mock).mockRejectedValueOnce(new Error('Rename failed'));

		render(<AnimatedNameInput {...defaultProps} />, { wrapper });
		fireEvent.focus(screen.getByTestId('AnimatedState-container'));
		await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument());
		const inputElement = screen.getByRole('textbox');
		fireEvent.change(inputElement, { target: { value: 'New Device Name' } });
		fireEvent.submit(screen.getByRole('form'));

		await waitFor(() => {
			expect(mockToast).toHaveBeenCalledWith({
				variant: 'destructive',
				title: 'Uh oh! Something went wrong.',
				description: 'There was a problem with renaming the device',
				action: expect.any(Object),
			});
		});
	});
});
