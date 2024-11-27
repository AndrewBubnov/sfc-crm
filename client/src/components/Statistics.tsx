import { useContext } from 'react';
import { StateGraphFillDto, TypeGraphFillDto } from '@/constants.ts';
import { StatisticsContext } from '@/providers/StatisticsContext.ts';
import { Chart } from '@/components/Chart.tsx';

export const Statistics = () => {
	const { stateStats, typeStats, total } = useContext(StatisticsContext);

	return (
		<div className="flex w-[70vw] justify-between">
			<Chart data={stateStats} total={total} dto={StateGraphFillDto} name="state" />
			<Chart data={typeStats} total={total} dto={TypeGraphFillDto} name="type" />
		</div>
	);
};
