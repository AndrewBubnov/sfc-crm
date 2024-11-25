import { createContext } from 'react';
import { GraphData } from '@/types.ts';

type StatisticsContextProps = {
	statistics: GraphData[];
	total: number;
	updateStatistics(evt: MessageEvent): void;
};

export const StatisticsContext = createContext<StatisticsContextProps>({} as StatisticsContextProps);
