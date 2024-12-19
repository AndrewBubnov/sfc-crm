import { useContext, useMemo } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { StatisticsContext } from '@/providers/StatisticsContext.ts';
import { useManageSearchParams } from '@/modules/shared/hooks/useManageSearchParams.ts';
import { QueryKeys } from '@/modules/shared/queryKeys.ts';

export const useGetQueryDetails = (queryKey = QueryKeys.Devices) => {
	const { total, filteredTotal } = useContext(StatisticsContext);
	const { page, sort, limit, filters } = useManageSearchParams();
	const isFetching = Boolean(useIsFetching({ queryKey: [queryKey, page, sort, limit, filters] }));

	return useMemo(
		() => ({
			filteredTotal,
			isFetching,
			isInitFetching: isFetching && !total,
		}),
		[filteredTotal, isFetching, total]
	);
};
