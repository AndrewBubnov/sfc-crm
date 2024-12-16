import { describe, it, expect } from 'vitest';
import { createFilterQueryString } from '@/modules/shared/utils.ts';
import { Filter } from '@/types.ts';

describe('createFilterQueryString', () => {
	it('should return a query string with one filter', () => {
		const filters: Filter[] = [{ field: 'name', search: 'device1' }];
		const result = createFilterQueryString(filters);
		expect(result).toStrictEqual('&filter_by=device1&filter_field=name');
	});

	it('should return a query string with multiple filters', () => {
		const filters: Filter[] = [
			{ field: 'name', search: 'device1' },
			{ field: 'type', search: 'sensor' },
		];
		const result = createFilterQueryString(filters);
		expect(result).toStrictEqual('&filter_by=device1&filter_by=sensor&filter_field=name&filter_field=type');
	});

	it('should ignore filters with empty search values', () => {
		const filters: Filter[] = [
			{ field: 'name', search: '' },
			{ field: 'type', search: 'sensor' },
		];
		const result = createFilterQueryString(filters);
		expect(result).toStrictEqual('&filter_by=sensor&filter_field=type');
	});

	it('should return an empty string if no filters have search values', () => {
		const filters: Filter[] = [
			{ field: 'name', search: '' },
			{ field: 'type', search: '' },
		];
		const result = createFilterQueryString(filters);
		expect(result).toStrictEqual('');
	});

	it('should handle an empty filters array', () => {
		const filters: Filter[] = [];
		const result = createFilterQueryString(filters);
		expect(result).toStrictEqual('');
	});

	it('should handle filters with undefined or null search values', () => {
		const filters: Filter[] = [
			{ field: 'name', search: null as unknown as string },
			{ field: 'type', search: undefined as unknown as string },
			{ field: 'state', search: 'active' },
		];
		const result = createFilterQueryString(filters);
		expect(result).toStrictEqual('&filter_by=active&filter_field=state');
	});

	it('should handle filters with undefined or null fields', () => {
		const filters: Filter[] = [
			{ field: null as unknown as string, search: 'value1' },
			{ field: undefined as unknown as string, search: 'value2' },
			{ field: 'name', search: 'device1' },
		];
		const result = createFilterQueryString(filters);
		expect(result).toStrictEqual('&filter_by=device1&filter_field=name');
	});
});
