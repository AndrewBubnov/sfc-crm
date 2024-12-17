import { describe, it, expect } from 'vitest';
import { QueryParam, Sort } from '@/types.ts';
import { updateSortParam } from '@/modules/shared/utils.ts';

describe('updateSortParam', () => {
	it('should add new sort parameters if none exist', () => {
		const params: string[][] = [];
		const sort: Sort = { sortBy: 'name', sortDesc: true };

		const result = updateSortParam(params, sort);

		expect(result).toEqual([
			[QueryParam.SortBy, 'name'],
			[QueryParam.SortDesc, 'true'],
		]);
	});

	it('should update existing sort parameters if they differ', () => {
		const params: string[][] = [
			[QueryParam.SortBy, 'type'],
			[QueryParam.SortDesc, 'false'],
		];
		const sort: Sort = { sortBy: 'name', sortDesc: true };

		const result = updateSortParam(params, sort);

		expect(result).toEqual([
			[QueryParam.SortBy, 'name'],
			[QueryParam.SortDesc, 'true'],
		]);
	});

	it('should remove sort parameters if the same sortBy and sortDesc are provided', () => {
		const params: string[][] = [
			[QueryParam.SortBy, 'name'],
			[QueryParam.SortDesc, 'true'],
		];
		const sort: Sort = { sortBy: 'name', sortDesc: true };

		const result = updateSortParam(params, sort);

		expect(result).toEqual([]);
	});

	it('should preserve other parameters when adding new sort parameters', () => {
		const params: string[][] = [[QueryParam.Page, '1']];
		const sort: Sort = { sortBy: 'name', sortDesc: false };

		const result = updateSortParam(params, sort);

		expect(result).toEqual([
			[QueryParam.SortBy, 'name'],
			[QueryParam.SortDesc, 'false'],
			[QueryParam.Page, '1'],
		]);
	});

	it('should preserve other parameters when updating existing sort parameters', () => {
		const params: string[][] = [
			[QueryParam.Page, '1'],
			[QueryParam.SortBy, 'type'],
			[QueryParam.SortDesc, 'false'],
		];
		const sort: Sort = { sortBy: 'name', sortDesc: true };

		const result = updateSortParam(params, sort);

		expect(result).toEqual([
			[QueryParam.Page, '1'],
			[QueryParam.SortBy, 'name'],
			[QueryParam.SortDesc, 'true'],
		]);
	});

	it('should preserve other parameters when removing sort parameters', () => {
		const params: string[][] = [
			[QueryParam.Page, '1'],
			[QueryParam.SortBy, 'name'],
			[QueryParam.SortDesc, 'true'],
		];
		const sort: Sort = { sortBy: 'name', sortDesc: true };

		const result = updateSortParam(params, sort);

		expect(result).toEqual([[QueryParam.Page, '1']]);
	});

	it('should not modify parameters if no sort parameters are found and sort is the same', () => {
		const params: string[][] = [
			[QueryParam.Page, '1'],
			[QueryParam.Limit, '10'],
		];
		const sort: Sort = { sortBy: '', sortDesc: false };

		const result = updateSortParam(params, sort);

		expect(result).toEqual([
			[QueryParam.SortBy, ''],
			[QueryParam.SortDesc, 'false'],
			[QueryParam.Page, '1'],
			[QueryParam.Limit, '10'],
		]);
	});
});
