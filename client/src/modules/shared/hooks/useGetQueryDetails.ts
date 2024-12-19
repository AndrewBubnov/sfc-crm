import { useContext, useMemo } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { QueryParamContext } from '@/providers/QueryParamContext.ts';
import { StatisticsContext } from '@/providers/StatisticsContext.ts';
import { QueryKeys } from '@/modules/shared/queryKeys.ts';

export const useGetQueryDetails = (queryKey = QueryKeys.Devices) => {
	const { total, filteredTotal } = useContext(StatisticsContext);
	const { page, sort, limit, filters } = useContext(QueryParamContext);
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
