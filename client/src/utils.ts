export const createIndexesList = (page: number, lastPage: number) => {
	const length = Math.min(lastPage, 3);
	if (page === 1) return Array.from({ length }, (_, index) => index + 1);
	if (page === lastPage)
		return Array.from({ length }, (_, index) => {
			if (index === length - 1) return page;
			if (index === length - 2) return page - 1;
			return page - 2;
		});
	return Array.from({ length }, (_, index) => {
		if (!index) return page - 1;
		if (index === 1) return page;
		return page + 1;
	});
};

export const capitalize = (text: string) => `${text.charAt(0).toUpperCase()}${text.slice(1)}`;

export const setGraphData = (statistics: Record<string, number>, total: number, dto: Record<string, string>) => {
	const keys = Object.keys(statistics);
	if (keys.length === 1) {
		const [key] = keys;
		return [
			{ name: key, value: statistics[key], fill: dto[key] },
			{ name: 'rest', value: total - statistics[key], fill: dto['all'] },
		];
	}
	return keys.map(key => ({
		name: key,
		value: statistics[key],
		fill: dto[key],
	}));
};