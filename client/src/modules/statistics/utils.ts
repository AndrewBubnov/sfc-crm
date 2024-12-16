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
