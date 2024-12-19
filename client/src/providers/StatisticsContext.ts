import { createContext } from 'react';
import { GraphData } from '@/types.ts';

export type StatisticsContextProps = {
	stateStats: GraphData[];
	typeStats: GraphData[];
	total: number;
	filteredTotal: number;
	updateStatistics(evt: MessageEvent): void;
};

export const StatisticsContext = createContext<StatisticsContextProps>({} as StatisticsContextProps);
