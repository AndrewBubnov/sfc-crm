import { useCallback, useMemo, useReducer } from 'react';
import { setSearchString } from '@/modules/shared/utils.ts';

export const useSearchParams = () => {
	const [, forceUpdate] = useReducer(x => x + 1, 0);

	const search = window.location.search;

	const paramsList = useMemo(() => [...new URLSearchParams(search)], [search]);

	const setParams = useCallback((params: string[][]) => {
		setSearchString(params);
		forceUpdate();
	}, []);

	return [paramsList, setParams] as const;
};
