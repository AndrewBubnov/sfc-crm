import { ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { StatisticsContext } from '@/providers/StatisticsContext.ts';
import { GraphData } from '@/types.ts';
import { setGraphData } from '@/utils.ts';
import { StateGraphFillDto, TypeGraphFillDto } from '@/constants.ts';

type StatisticsProviderProps = {
	children: ReactNode;
};

export const StatisticsProvider = ({ children }: StatisticsProviderProps) => {
	const [stateStats, setStateStats] = useState<GraphData[]>([]);
	const [typeStats, setTypeStats] = useState<GraphData[]>([]);
	const total = useRef<number>(0);

	const updateStatistics = useCallback((evt: MessageEvent) => {
		const {
			stats: { state: stateStatistics, type: typeStatistics },
		} = JSON.parse(evt.data);

		total.current = stateStatistics.total;
		delete stateStatistics.total;
		setStateStats(setGraphData(stateStatistics, total.current, StateGraphFillDto));
		setTypeStats(setGraphData(typeStatistics, total.current, TypeGraphFillDto));
	}, []);

	const value = useMemo(
		() => ({
			stateStats,
			typeStats,
			total: total.current,
			updateStatistics,
		}),
		[stateStats, typeStats, updateStatistics]
	);

	return <StatisticsContext.Provider value={value}>{children}</StatisticsContext.Provider>;
};
