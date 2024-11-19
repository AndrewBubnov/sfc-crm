import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NameInput } from '@/components/NameInput.tsx';
import { Mock, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renameDevice } from '@/api/renameDevice.ts';

const mockToast = vi.fn();

vi.mock('@/hooks/useToast', () => ({
	useToast: () => ({
		toast: mockToast,
	}),
}));

vi.mock('@/api/renameDevice', () => ({
	renameDevice: vi.fn(),
}));

describe('NameInput', () => {
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

	it('renders the input with the correct initial value', () => {
		render(
			<QueryClientProvider client={queryClient}>
				<NameInput {...defaultProps} />
			</QueryClientProvider>
		);
		const inputElement = screen.getByRole('textbox');
		expect(inputElement).toHaveValue('Old Device Name');
	});

	it('updates the input value when typed into', () => {
		render(
			<QueryClientProvider client={queryClient}>
				<NameInput {...defaultProps} />
			</QueryClientProvider>
		);
		const inputElement = screen.getByRole('textbox');
		fireEvent.change(inputElement, { target: { value: 'New Device Name' } });
		expect(inputElement).toHaveValue('New Device Name');
	});

	it('does not call mutate when the name is the same', async () => {
		render(
			<QueryClientProvider client={queryClient}>
				<NameInput {...defaultProps} />
			</QueryClientProvider>
		);
		const inputElement = screen.getByRole('textbox');
		fireEvent.change(inputElement, { target: { value: 'Old Device Name' } });

		await waitFor(() => expect(mockRenameDevice).not.toHaveBeenCalled());
	});

	it('calls mutate with the correct parameters when the name is changed', async () => {
		render(
			<QueryClientProvider client={queryClient}>
				<NameInput {...defaultProps} />
			</QueryClientProvider>
		);

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

		render(
			<QueryClientProvider client={queryClient}>
				<NameInput {...defaultProps} />
			</QueryClientProvider>
		);

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

		render(
			<QueryClientProvider client={queryClient}>
				<NameInput {...defaultProps} />
			</QueryClientProvider>
		);

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

	it('disables the input when mutation is in progress', async () => {
		let resolvePromise: (value: unknown) => void;
		const promise = new Promise(resolve => {
			resolvePromise = resolve;
		});

		(renameDevice as Mock).mockImplementationOnce(() => promise);

		render(
			<QueryClientProvider client={queryClient}>
				<NameInput {...defaultProps} />
			</QueryClientProvider>
		);

		const inputElement = screen.getByRole('textbox');

		expect(inputElement).not.toBeDisabled();

		fireEvent.change(inputElement, { target: { value: 'New Device Name' } });
		fireEvent.submit(screen.getByRole('form'));

		await waitFor(() => {
			expect(inputElement).toBeDisabled();
		});

		resolvePromise!({});

		await waitFor(() => {
			expect(inputElement).not.toBeDisabled();
		});
	});
});
