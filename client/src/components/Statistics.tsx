import { useContext } from 'react';
import { StatisticsContext } from '@/providers/StatisticsContext.ts';
import { Chart } from '@/components/Chart.tsx';
import { PaginatedDataContext } from '@/providers/PaginatedDataContext.ts';
import { Skeleton } from '@/components/Skeleton.tsx';
import { StateGraphFillDto, TypeGraphFillDto } from '@/constants.ts';

export const Statistics = () => {
	const { stateStats, typeStats, total } = useContext(StatisticsContext);
	const { isInitFetching } = useContext(PaginatedDataContext);

	return (
		<div className="flex justify-between items-center">
			<Skeleton isLoading={isInitFetching} className="w-[75vw] h-[220px] rounded-md">
				<Chart data={typeStats} total={total} dto={TypeGraphFillDto} name="type" />
				<Chart data={stateStats} total={total} dto={StateGraphFillDto} name="state" />
			</Skeleton>
		</div>
	);
};
