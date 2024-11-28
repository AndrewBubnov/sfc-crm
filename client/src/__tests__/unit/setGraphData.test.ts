import { describe, it, expect } from 'vitest';
import { setGraphData } from '@/utils.ts';

describe('setGraphData', () => {
	it('should return data with "rest" when statistics has only one key', () => {
		const statistics = { key1: 30 };
		const total = 100;
		const dto = { key1: '#ff0000', all: '#cccccc' };
		const result = setGraphData(statistics, total, dto);
		expect(result).toStrictEqual([
			{ name: 'key1', value: 30, fill: '#ff0000' },
			{ name: 'rest', value: 70, fill: '#cccccc' },
		]);
	});

	it('should return mapped data when statistics has multiple keys', () => {
		const statistics = { key1: 30, key2: 50, key3: 20 };
		const total = 100;
		const dto = { key1: '#ff0000', key2: '#00ff00', key3: '#0000ff' };
		const result = setGraphData(statistics, total, dto);
		expect(result).toStrictEqual([
			{ name: 'key1', value: 30, fill: '#ff0000' },
			{ name: 'key2', value: 50, fill: '#00ff00' },
			{ name: 'key3', value: 20, fill: '#0000ff' },
		]);
	});

	it('should handle empty statistics and return empty array', () => {
		const statistics = {};
		const total = 100;
		const dto = { all: '#cccccc' };
		const result = setGraphData(statistics, total, dto);
		expect(result).toStrictEqual([]);
	});

	it('should handle total being 0 and statistics having one key', () => {
		const statistics = { key1: 0 };
		const total = 0;
		const dto = { key1: '#ff0000', all: '#cccccc' };
		const result = setGraphData(statistics, total, dto);
		expect(result).toStrictEqual([
			{ name: 'key1', value: 0, fill: '#ff0000' },
			{ name: 'rest', value: 0, fill: '#cccccc' },
		]);
	});

	it('should handle total being 0 and multiple keys in statistics', () => {
		const statistics = { key1: 0, key2: 0 };
		const total = 0;
		const dto = { key1: '#ff0000', key2: '#00ff00' };
		const result = setGraphData(statistics, total, dto);
		expect(result).toStrictEqual([
			{ name: 'key1', value: 0, fill: '#ff0000' },
			{ name: 'key2', value: 0, fill: '#00ff00' },
		]);
	});

	it('should handle missing keys in dto', () => {
		const statistics = { key1: 30, key2: 50 };
		const total = 100;
		const dto = { key1: '#ff0000' }; // key2 missing
		const result = setGraphData(statistics, total, dto);
		expect(result).toStrictEqual([
			{ name: 'key1', value: 30, fill: '#ff0000' },
			{ name: 'key2', value: 50, fill: undefined },
		]);
	});

	it('should handle missing "all" in dto for "rest" calculation', () => {
		const statistics = { key1: 30 };
		const total = 100;
		const dto = { key1: '#ff0000' }; // 'all' missing
		const result = setGraphData(statistics, total, dto);
		expect(result).toStrictEqual([
			{ name: 'key1', value: 30, fill: '#ff0000' },
			{ name: 'rest', value: 70, fill: undefined },
		]);
	});
});
