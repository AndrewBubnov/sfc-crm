import { describe, it, expect } from 'vitest';
import { updateSingleValueParam } from '@/modules/shared/utils.ts';
import { QueryParam } from '@/types.ts';

describe('updateSingleValueParam', () => {
	it('should add a new parameter if it does not exist in the list', () => {
		const paramsList: string[][] = [];
		const parameter = 10;

		const result = updateSingleValueParam(paramsList, parameter, QueryParam.Page);

		expect(result).toEqual([[QueryParam.Page, '10']]);
	});

	it('should update an existing parameter if it already exists', () => {
		const paramsList: string[][] = [[QueryParam.Page, '5']];
		const parameter = 10;

		const result = updateSingleValueParam(paramsList, parameter, QueryParam.Page);

		expect(result).toEqual([[QueryParam.Page, '10']]);
	});

	it('should preserve other parameters in the list when adding a new one', () => {
		const paramsList: string[][] = [[QueryParam.Limit, '20']];
		const parameter = 10;

		const result = updateSingleValueParam(paramsList, parameter, QueryParam.Page);

		expect(result).toEqual([
			[QueryParam.Limit, '20'],
			[QueryParam.Page, '10'],
		]);
	});

	it('should preserve other parameters in the list when updating an existing one', () => {
		const paramsList: string[][] = [
			[QueryParam.Page, '5'],
			[QueryParam.Limit, '20'],
		];
		const parameter = 15;

		const result = updateSingleValueParam(paramsList, parameter, QueryParam.Page);

		expect(result).toEqual([
			[QueryParam.Page, '15'],
			[QueryParam.Limit, '20'],
		]);
	});

	it('should handle an empty parameters list gracefully', () => {
		const paramsList: string[][] = [];
		const parameter = 25;

		const result = updateSingleValueParam(paramsList, parameter, QueryParam.Limit);

		expect(result).toEqual([[QueryParam.Limit, '25']]);
	});

	it('should update the correct parameter if multiple exist', () => {
		const paramsList: string[][] = [
			[QueryParam.Page, '5'],
			[QueryParam.Limit, '20'],
		];
		const parameter = 50;

		const result = updateSingleValueParam(paramsList, parameter, QueryParam.Limit);

		expect(result).toEqual([
			[QueryParam.Page, '5'],
			[QueryParam.Limit, '50'],
		]);
	});
});
