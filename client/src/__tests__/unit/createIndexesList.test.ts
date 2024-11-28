import { describe, it, expect } from 'vitest';
import { createIndexesList } from '@/utils.ts';

describe('createIndexesList', () => {
	it('should return [1] when page is 1 and lastPage is 1', () => {
		expect(createIndexesList(1, 1)).toStrictEqual([1]);
	});

	it('should return [1, 2] when page is 1 and lastPage is 2', () => {
		expect(createIndexesList(1, 2)).toStrictEqual([1, 2]);
	});

	it('should return [1, 2, 3] when page is 1 and lastPage is 3', () => {
		expect(createIndexesList(1, 3)).toStrictEqual([1, 2, 3]);
	});

	it('should return [2, 3, 4] when page is 3 and lastPage is 4', () => {
		expect(createIndexesList(3, 4)).toStrictEqual([2, 3, 4]);
	});

	it('should return [4, 5, 6] when page is 5 and lastPage is 6', () => {
		expect(createIndexesList(5, 6)).toStrictEqual([4, 5, 6]);
	});

	it('should return [4, 5, 6] when page is 5 and lastPage is 10', () => {
		expect(createIndexesList(5, 10)).toStrictEqual([4, 5, 6]);
	});

	it('should return [8, 9, 10] when page is 10 and lastPage is 10', () => {
		expect(createIndexesList(10, 10)).toStrictEqual([8, 9, 10]);
	});

	it('should return [1, 2, 3] when page is 2 and lastPage is 3', () => {
		expect(createIndexesList(2, 3)).toStrictEqual([1, 2, 3]);
	});

	it('should handle edge case when lastPage < 3 and return correct list', () => {
		expect(createIndexesList(2, 2)).toStrictEqual([1, 2]);
	});

	it('should handle edge case when page > lastPage and still return valid indexes', () => {
		expect(createIndexesList(5, 3)).toStrictEqual([1, 2, 3]);
	});
});
