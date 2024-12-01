import { createContext } from 'react';
import { GraphData } from '@/types.ts';

type StatisticsContextProps = {
	stateStats: GraphData[];
	typeStats: GraphData[];
	total: number;
	updateStatistics(evt: MessageEvent): void;
};

export const StatisticsContext = createContext<StatisticsContextProps>({} as StatisticsContextProps);
