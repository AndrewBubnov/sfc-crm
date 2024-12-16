import { useContext } from 'react';
import { StatisticsContext } from '@/providers/StatisticsContext.ts';
import { Chart } from '@/modules/statistics/components/Chart.tsx';
import { Skeleton } from '@/modules/shared/components/Skeleton.tsx';
import { useGetQueryDetails } from '@/modules/shared/hooks/useGetQueryDetails.ts';
import { StateGraphFillDto, TypeGraphFillDto } from '@/modules/statistics/constants.ts';

export const Statistics = () => {
	const { stateStats, typeStats, total } = useContext(StatisticsContext);
	const { isInitFetching } = useGetQueryDetails();

	return (
		<div className="flex justify-between items-center">
			<Skeleton isLoading={isInitFetching} className="w-[75vw] h-[220px] rounded-md">
				<Chart data={typeStats} total={total} dto={TypeGraphFillDto} name="type" />
				<Chart data={stateStats} total={total} dto={StateGraphFillDto} name="state" />
			</Skeleton>
		</div>
	);
};
