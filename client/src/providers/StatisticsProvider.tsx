import { ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { GraphFillDto } from '@/constants.ts';
import { StatisticsContext } from '@/providers/StatisticsContext.ts';
import { GraphData } from '@/types.ts';

type StatisticsProviderProps = {
	children: ReactNode;
};

export const StatisticsProvider = ({ children }: StatisticsProviderProps) => {
	const [statistics, setStatistics] = useState<GraphData[]>([]);
	const total = useRef<number>(0);

	const updateStatistics = useCallback((evt: MessageEvent) => {
		const { stats } = JSON.parse(evt.data);
		total.current = stats.total;
		delete stats.total;
		setStatistics(() => {
			const keys = Object.keys(stats);
			if (keys.length === 1) {
				const [key] = keys;
				return [
					{ name: key, value: stats[key], fill: GraphFillDto[key] },
					{ name: 'rest', value: total.current - stats[key], fill: GraphFillDto['all'] },
				];
			}
			return keys.map(key => ({
				name: key,
				value: stats[key],
				fill: GraphFillDto[key],
			}));
		});
	}, []);

	const value = useMemo(
		() => ({
			statistics,
			total: total.current,
			updateStatistics,
		}),
		[statistics, updateStatistics]
	);

	return <StatisticsContext.Provider value={value}>{children}</StatisticsContext.Provider>;
};
