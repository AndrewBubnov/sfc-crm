import { describe, it, expect } from 'vitest';
import { getReducedFilterQueryParams } from '@/modules/shared/utils.ts';
import { Filter, FilterField, QueryParam } from '@/types.ts';

describe('getReducedFilterQueryParams', () => {
	it('should handle empty parameters gracefully', () => {
		const params: string[][] = [];
		const filter: Filter = { [QueryParam.Field]: 'name', [QueryParam.Search]: 'John' };

		const result = getReducedFilterQueryParams(params, filter);

		expect(result.queryParams).toStrictEqual([
			[QueryParam.Field, 'name'],
			[QueryParam.Search, 'John'],
		]);
		expect(result.filters).toStrictEqual([{ [QueryParam.Field]: 'name', [QueryParam.Search]: 'John' }]);
	});

	it('should add a new filter if it does not exist', () => {
		const params: string[][] = [
			[QueryParam.Field, 'type'],
			[QueryParam.Search, 'admin'],
		];
		const filter: Filter = { [QueryParam.Field]: 'name', [QueryParam.Search]: 'John' };

		const result = getReducedFilterQueryParams(params, filter);

		expect(result.queryParams).toStrictEqual([
			[QueryParam.Field, 'type'],
			[QueryParam.Search, 'admin'],
			[QueryParam.Field, 'name'],
			[QueryParam.Search, 'John'],
		]);
		expect(result.filters).toStrictEqual([
			{ [QueryParam.Field]: 'type', [QueryParam.Search]: 'admin' },
			{ [QueryParam.Field]: 'name', [QueryParam.Search]: 'John' },
		]);
	});

	it('should update an existing filter if field already exists', () => {
		const params: string[][] = [
			[QueryParam.Field, 'name'],
			[QueryParam.Search, 'Doe'],
		];
		const filter: Filter = { [QueryParam.Field]: 'name', [QueryParam.Search]: 'John' };

		const result = getReducedFilterQueryParams(params, filter);

		expect(result.queryParams).toStrictEqual([
			[QueryParam.Field, 'name'],
			[QueryParam.Search, 'John'],
		]);
		expect(result.filters).toStrictEqual([{ [QueryParam.Field]: 'name', [QueryParam.Search]: 'John' }]);
	});

	it('should remove a filter if the search field is empty', () => {
		const params: string[][] = [
			[QueryParam.Field, 'name'],
			[QueryParam.Search, 'Doe'],
		];
		const filter: Filter = { [QueryParam.Field]: 'name', [QueryParam.Search]: '' };

		const result = getReducedFilterQueryParams(params, filter);

		expect(result.queryParams).toStrictEqual([]);
		expect(result.filters).toStrictEqual([]);
	});

	it('should handle multiple filters correctly', () => {
		const params: string[][] = [
			[QueryParam.Field, 'name'],
			[QueryParam.Search, 'Doe'],
		];
		const filter: Filter = { [QueryParam.Field]: 'type', [QueryParam.Search]: 'admin' };

		const result = getReducedFilterQueryParams(params, filter);

		expect(result.queryParams).toStrictEqual([
			[QueryParam.Field, 'name'],
			[QueryParam.Search, 'Doe'],
			[QueryParam.Field, 'type'],
			[QueryParam.Search, 'admin'],
		]);
		expect(result.filters).toStrictEqual([
			{ [QueryParam.Field]: 'name', [QueryParam.Search]: 'Doe' },
			{ [QueryParam.Field]: 'type', [QueryParam.Search]: 'admin' },
		]);
	});

	it('should handle removal of one filter while keeping others intact', () => {
		const params: string[][] = [
			[QueryParam.Field, 'name'],
			[QueryParam.Search, 'Doe'],
			[QueryParam.Field, 'type'],
			[QueryParam.Search, 'admin'],
		];
		const filter: Filter = { [QueryParam.Field]: 'name', [QueryParam.Search]: '' };

		const result = getReducedFilterQueryParams(params, filter);

		expect(result.queryParams).toStrictEqual([
			[QueryParam.Field, 'type'],
			[QueryParam.Search, 'admin'],
		]);
		expect(result.filters).toStrictEqual([{ [QueryParam.Field]: 'type', [QueryParam.Search]: 'admin' }]);
	});

	it('should return empty queryParams and filters if both parameters and filter are empty', () => {
		const params: string[][] = [];
		const filter: Filter = { [QueryParam.Field]: '' as FilterField, [QueryParam.Search]: '' };

		const result = getReducedFilterQueryParams(params, filter);

		expect(result.queryParams).toStrictEqual([]);
		expect(result.filters).toStrictEqual([]);
	});

	it('should not modify params if the filter matches an empty search', () => {
		const params: string[][] = [
			[QueryParam.Field, 'name'],
			[QueryParam.Search, ''],
		];
		const filter: Filter = { [QueryParam.Field]: 'name', [QueryParam.Search]: '' };

		const result = getReducedFilterQueryParams(params, filter);

		expect(result.queryParams).toStrictEqual([]);
		expect(result.filters).toStrictEqual([]);
	});
});
