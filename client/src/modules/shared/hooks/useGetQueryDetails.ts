import { useIsFetching } from '@tanstack/react-query';
import { useMemo } from 'react';
import { QueryKeys } from '@/modules/shared/queryKeys.ts';
import { useManageSearchParams } from '@/modules/shared/hooks/useManageSearchParams.ts';
import { useGetQueryData } from '@/modules/shared/hooks/useGetQueryData.ts';

export const useGetQueryDetails = (queryKey = QueryKeys.Devices) => {
	const { page, sort, limit, filters } = useManageSearchParams();
	const queryData = useGetQueryData({ page, limit, filters, sort });
	const isFetching = Boolean(useIsFetching({ queryKey: [queryKey, page, sort, limit, filters] }));

	const total = queryData?.total;

	return useMemo(
		() => ({
			total,
			isFetching,
			isInitFetching: isFetching && !total,
		}),
		[isFetching, total]
	);
};
