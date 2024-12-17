import { ReactNode } from 'react';
import { describe, it, vi, expect } from 'vitest';
import { StatisticsContext, StatisticsContextProps } from '@/providers/StatisticsContext';
import { renderHook } from '@testing-library/react';
import { useGetQueryDetails } from '@/modules/shared/hooks/useGetQueryDetails.ts';

let useIsFetchingMockReturnValue = 0;
const useManageSearchParamsMockReturnValue = {
	page: 2,
	sort: { sortBy: 'name', sortDesc: false },
	limit: 20,
	filters: [{ field: 'type', search: 'test' }],
};

vi.mock('@tanstack/react-query', () => ({
	useIsFetching: () => useIsFetchingMockReturnValue,
}));

vi.mock('@/modules/shared/hooks/useManageSearchParams', () => ({
	useManageSearchParams: () => useManageSearchParamsMockReturnValue,
}));

const createWrapper =
	(total: number) =>
	({ children }: { children: ReactNode }) => (
		<StatisticsContext.Provider value={{ total } as StatisticsContextProps}>{children}</StatisticsContext.Provider>
	);

describe('useGetQueryDetails', () => {
	it('should return initial fetching state when loading and total is 0', () => {
		useIsFetchingMockReturnValue = 1;
		const { result } = renderHook(useGetQueryDetails, { wrapper: createWrapper(0) });
		expect(result.current.isFetching).toBe(true);
		expect(result.current.isInitFetching).toBe(true);
		expect(result.current.total).toBe(0);
	});

	it('should return non-initial fetching state when loading and total is greater than 0', () => {
		useIsFetchingMockReturnValue = 1;
		const { result } = renderHook(useGetQueryDetails, { wrapper: createWrapper(100) });
		expect(result.current.isFetching).toBe(true);
		expect(result.current.isInitFetching).toBe(false);
		expect(result.current.total).toBe(100);
	});

	it('should return not fetching state when not loading', () => {
		useIsFetchingMockReturnValue = 0;
		const { result } = renderHook(useGetQueryDetails, { wrapper: createWrapper(50) });
		expect(result.current.isFetching).toBe(false);
		expect(result.current.isInitFetching).toBe(false);
		expect(result.current.total).toBe(50);
	});
});
