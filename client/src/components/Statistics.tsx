import { useContext } from 'react';
import { StateGraphFillDto, TypeGraphFillDto } from '@/constants.ts';
import { StatisticsContext } from '@/providers/StatisticsContext.ts';
import { Chart } from '@/components/Chart.tsx';

export const Statistics = () => {
	const { stateStats, typeStats, total } = useContext(StatisticsContext);

	return (
		<div className="flex w-[75vw] justify-between items-center">
			<Chart data={typeStats} total={total} dto={TypeGraphFillDto} name="type" />
			<div className="h-[50%] w-[1px] bg-gray-300" />
			<Chart data={stateStats} total={total} dto={StateGraphFillDto} name="state" />
		</div>
	);
};
