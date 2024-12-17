import { describe, it, expect } from 'vitest';
import { QueryParam } from '@/types.ts';
import { getSingleValueParam } from '@/modules/shared/utils.ts';

describe('getSingleValueParam', () => {
	it('should return the parameter value if it exists', () => {
		const params: string[][] = [[QueryParam.Page, '5']];
		const result = getSingleValueParam(params, QueryParam.Page, 1);

		expect(result).toBe(5);
	});

	it('should return the default value if the parameter does not exist', () => {
		const params: string[][] = [[QueryParam.Limit, '10']];
		const result = getSingleValueParam(params, QueryParam.Page, 1);

		expect(result).toBe(1);
	});

	it('should return the default value if the parameters list is empty', () => {
		const params: string[][] = [];
		const result = getSingleValueParam(params, QueryParam.Page, 1);

		expect(result).toBe(1);
	});

	it('should return the default value if the parameter value is not a number', () => {
		const params: string[][] = [[QueryParam.Page, 'not-a-number']];
		const result = getSingleValueParam(params, QueryParam.Page, 1);

		expect(result).toBe(1);
	});

	it('should return the first matching parameter value if multiple exist', () => {
		const params: string[][] = [
			[QueryParam.Page, '5'],
			[QueryParam.Page, '10'],
		];
		const result = getSingleValueParam(params, QueryParam.Page, 1);

		expect(result).toBe(5);
	});

	it('should not affect other parameters in the list', () => {
		const params: string[][] = [
			[QueryParam.Page, '5'],
			[QueryParam.Limit, '10'],
		];
		const result = getSingleValueParam(params, QueryParam.Page, 1);

		expect(result).toBe(5);
	});

	it('should correctly return a large numeric parameter value', () => {
		const params: string[][] = [[QueryParam.Page, '1000']];
		const result = getSingleValueParam(params, QueryParam.Page, 1);

		expect(result).toBe(1000);
	});
});
