import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { QueryKeys } from '@/modules/shared/queryKeys.ts';
import { useQueryParams } from '@/modules/shared/hooks/useQueryParams.ts';
import { Device } from '@/types.ts';
import { getSingleValueParam } from '@/modules/shared/utils.ts';

type QueryData = Record<'data', { items: Device[]; total: number }>;

export const useGetQueryDetails = () => {
	const queryClient = useQueryClient();

	const { paramsList, sort, limit, filters } = useQueryParams();

	const [total, setTotal] = useState<number>(0);

	const page = useMemo(() => getSingleValueParam(paramsList, 'page', 1), [paramsList]);
	const queryData = queryClient.getQueryData<QueryData>([QueryKeys.Devices, page, sort, limit, filters]);
	const isFetching = Boolean(useIsFetching({ queryKey: [QueryKeys.Devices, page, sort, limit, filters] }));

	useEffect(() => {
		if (queryData?.data.total) setTotal(queryData?.data.total);
	}, [queryData?.data.total]);

	return useMemo(
		() => ({
			total,
			isFetching,
			isInitFetching: isFetching && !total,
		}),
		[isFetching, total]
	);
};
