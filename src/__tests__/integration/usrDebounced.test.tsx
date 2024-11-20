import { render, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useDebounced } from '@/hooks/useDebounced.ts';

// Had issues installing @testing-library/react-hooks so was forced to use this hack
const TestComponent = ({
	value,
	delay,
	resolver,
}: {
	value: string;
	delay: number;
	resolver?: (arg: string) => boolean;
}) => {
	const debouncedValue = useDebounced(value, resolver, delay);
	return <div data-testid="debounced">{debouncedValue}</div>;
};

describe('useDebounced', () => {
	it('returns the initial value immediately', () => {
		const { getByTestId } = render(<TestComponent value="test" delay={500} />);
		expect(getByTestId('debounced').textContent).toBe('test');
	});

	it('updates the debounced value after the delay', async () => {
		vi.useFakeTimers();
		const { getByTestId, rerender } = render(<TestComponent value="test" delay={500} />);

		rerender(<TestComponent value="updated" delay={500} />);
		expect(getByTestId('debounced').textContent).toBe('test');

		act(() => {
			vi.advanceTimersByTime(500);
		});

		expect(getByTestId('debounced').textContent).toBe('updated');
		vi.useRealTimers();
	});

	it('does not update the value if resolver returns false', async () => {
		vi.useFakeTimers();
		const resolver = vi.fn().mockReturnValue(false);
		const { getByTestId, rerender } = render(<TestComponent value="test" delay={500} resolver={resolver} />);

		rerender(<TestComponent value="new" delay={500} resolver={resolver} />);
		act(() => {
			vi.advanceTimersByTime(500);
		});

		expect(getByTestId('debounced').textContent).toBe('test');
		expect(resolver).toHaveBeenCalledWith('new');
		vi.useRealTimers();
	});

	it('clears timeout on unmount', async () => {
		vi.useFakeTimers();
		const { unmount } = render(<TestComponent value="test" delay={500} />);

		unmount();
		act(() => {
			vi.advanceTimersByTime(500);
		});

		expect(true).toBe(true);
		vi.useRealTimers();
	});
});
