import { describe, it, expect } from 'vitest';
import { QueryParam } from '@/types.ts';
import { getSortParam } from '@/modules/shared/utils.ts';

describe('getSortParam', () => {
	it('should return the `sortBy` and `sortDesc` when both parameters are present', () => {
		const params: string[][] = [
			[QueryParam.SortBy, 'name'],
			[QueryParam.SortDesc, 'true'],
		];
		const result = getSortParam(params);

		expect(result).toEqual({ sortBy: 'name', sortDesc: true });
	});

	it('should return default values when `SortBy` is missing', () => {
		const params: string[][] = [
			[QueryParam.Page, '1'],
			[QueryParam.Limit, '10'],
		];
		const result = getSortParam(params);

		expect(result).toEqual({ sortBy: '', sortDesc: false });
	});

	it('should return default values when `SortDesc` is missing', () => {
		const params: string[][] = [[QueryParam.SortBy, 'name']];
		const result = getSortParam(params);

		expect(result).toEqual({ sortBy: '', sortDesc: false });
	});

	it('should return default values when both `SortBy` and SortDesc are missing', () => {
		const params: string[][] = [];
		const result = getSortParam(params);

		expect(result).toEqual({ sortBy: '', sortDesc: false });
	});

	it("should handle `SortDesc` with 'false' value correctly", () => {
		const params: string[][] = [
			[QueryParam.SortBy, 'name'],
			[QueryParam.SortDesc, 'false'],
		];
		const result = getSortParam(params);

		expect(result).toEqual({ sortBy: 'name', sortDesc: false });
	});

	it('should ignore unrelated parameters and focus only on SortBy and `SortDesc`', () => {
		const params: string[][] = [
			[QueryParam.Page, '1'],
			[QueryParam.SortBy, 'type'],
			[QueryParam.SortDesc, 'true'],
			[QueryParam.Limit, '20'],
		];
		const result = getSortParam(params);

		expect(result).toEqual({ sortBy: 'type', sortDesc: true });
	});

	it('should return default values if `SortDesc` is misplaced in the list', () => {
		const params: string[][] = [
			[QueryParam.SortBy, 'type'],
			[QueryParam.Page, '1'],
		];
		const result = getSortParam(params);

		expect(result).toEqual({ sortBy: 'type', sortDesc: false });
	});
});
