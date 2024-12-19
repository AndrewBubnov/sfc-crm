import { ReactNode } from 'react';
import { QueryParamContext, QueryParamContextProps } from '@/providers/QueryParamContext.ts';
import { describe, it, vi, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ClearFilters } from '@/modules/controls/components/ClearFilters.tsx';

let mockContextValue: Partial<QueryParamContextProps> = {
	filters: [
		{ field: 'name', search: 'John' },
		{ field: 'type', search: '' },
	],
	resetFilters: vi.fn(),
};

const createWrapper =
	(value: Partial<QueryParamContextProps>) =>
	({ children }: { children: ReactNode }) => (
		<QueryParamContext.Provider value={value as QueryParamContextProps}>{children}</QueryParamContext.Provider>
	);

describe('ClearFilters', () => {
	it('should render button when there are active filters', () => {
		render(<ClearFilters />, { wrapper: createWrapper(mockContextValue) });

		expect(screen.getByRole('button', { name: /clear all filters/i })).toBeInTheDocument();
		expect(screen.getByText(/name/i)).toBeInTheDocument();
	});

	it('should not render anything when there are no active filters', () => {
		mockContextValue.filters = [
			{ field: 'name', search: '' },
			{ field: 'type', search: '' },
		];

		render(<ClearFilters />, { wrapper: createWrapper(mockContextValue) });

		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});

	it('should call resetFilters when button is clicked', () => {
		const resetFiltersMock = vi.fn();
		mockContextValue = {
			filters: [
				{ field: 'name', search: 'John' },
				{ field: 'type', search: 'Admin' },
			],
			resetFilters: resetFiltersMock,
		};

		render(<ClearFilters />, { wrapper: createWrapper(mockContextValue) });

		const button = screen.getByRole('button', { name: /clear all filters/i });
		fireEvent.click(button);

		expect(resetFiltersMock).toHaveBeenCalled();
	});

	it('should list all active filters in the button text', () => {
		mockContextValue.filters = [
			{ field: 'name', search: 'John' },
			{ field: 'type', search: 'Admin' },
		];

		render(<ClearFilters />, { wrapper: createWrapper(mockContextValue) });

		expect(screen.getByText(/name, type/i)).toBeInTheDocument();
	});

	it('should correctly render with a single active filter', () => {
		mockContextValue.filters = [{ field: 'id', search: '123' }];

		render(<ClearFilters />, { wrapper: createWrapper(mockContextValue) });

		expect(screen.getByRole('button', { name: /clear all filters/i })).toBeInTheDocument();
		expect(screen.getByText(/id/i)).toBeInTheDocument();
	});
});
