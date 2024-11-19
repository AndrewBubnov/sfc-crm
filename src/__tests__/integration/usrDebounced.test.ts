import { renderHook } from '@testing-library/react-hooks';
import { describe, it, expect, vi } from 'vitest';
import { useDebounced } from '@/hooks/useDebounced.ts';
import { act } from 'react';

describe('useDebounced', () => {
	vi.useFakeTimers();

	it('returns initial value immediately', () => {
		const { result } = renderHook(() => useDebounced(10));
		expect(result.current).toBe(10);
	});

	it('updates value after delay', () => {
		const { result, rerender } = renderHook(props => useDebounced(props, undefined, 500), { initialProps: 10 });

		rerender(20);
		expect(result.current).toBe(10);

		act(() => {
			vi.advanceTimersByTime(500);
		});

		expect(result.current).toBe(20);
	});

	it('uses custom resolver', () => {
		const mockResolver = vi.fn(val => val > 15);
		const { result, rerender } = renderHook(props => useDebounced(props, mockResolver, 500), { initialProps: 10 });

		rerender(20);

		act(() => {
			vi.advanceTimersByTime(500);
		});

		expect(mockResolver).toHaveBeenCalledWith(20);
		expect(result.current).toBe(20);

		rerender(12);

		act(() => {
			vi.advanceTimersByTime(500);
		});

		expect(result.current).toBe(20);
	});

	it('clears timeout on unmount', () => {
		const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

		const { unmount } = renderHook(() => useDebounced(10));
		unmount();

		expect(clearTimeoutSpy).toHaveBeenCalled();
	});
});
