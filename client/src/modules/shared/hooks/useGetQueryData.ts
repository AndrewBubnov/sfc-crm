import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { QueryKeys } from '@/modules/shared/queryKeys.ts';
import { Filter, QueryData, Sort } from '@/types.ts';

type UseGetQueryData = {
	page: number;
	limit: number;
	sort: Sort;
	filters: Filter[];
	queryKey?: string;
};

export const useGetQueryData = ({ page, sort, limit, filters, queryKey = QueryKeys.Devices }: UseGetQueryData) => {
	const queryClient = useQueryClient();

	const [data, setData] = useState<QueryData['data']>();

	const queryData = queryClient.getQueryData<QueryData>([queryKey, page, sort, limit, filters]);

	useEffect(() => {
		if (queryData?.data) setData(queryData?.data);
	}, [queryData?.data]);

	return data;
};
