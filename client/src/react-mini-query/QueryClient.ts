import {
	Query,
	QueryState,
	QueryStatus,
	QueryKey,
	GetQuery,
	CreateQuery,
	QueryClientProps,
	Updater,
	QueryStateUpdater,
} from './types.ts';
import { isEqual } from './utils.ts';
import { getPreviousQueryKeyHash } from './PreviousDataStore.ts';

const createQuery = <T>({ queryKey, queryFn, previousData }: CreateQuery<T>): Query<T> => {
	const query: Query<T> = {
		queryKey,
		tempFetch: null,
		listeners: new Set(),
		state: {
			status: QueryStatus.Pending,
			isLoading: false,
			data: undefined,
			error: undefined,
			lastUpdated: 0,
			refetch: async () => {},
		},

		notify: () => {
			query.listeners.forEach(listener => listener());
		},

		setState: (updater: (arg: QueryState<T>) => QueryState<T>) => {
			query.state = updater(query.state);
			query.notify();
		},

		fetch: async () => {
			if (query.tempFetch) return query.tempFetch;

			query.setState(state => ({
				...state,
				...(previousData && { data: previousData }),
				isLoading: !previousData,
				error: undefined,
			}));

			query.tempFetch = (async () => {
				try {
					const data = (await queryFn()) as T;
					query.setState(state => ({
						...state,
						status: QueryStatus.Success,
						data,
						lastUpdated: Date.now(),
					}));
				} catch (error) {
					query.setState(state => ({
						...state,
						status: QueryStatus.Error,
						error: error as Error,
					}));
				} finally {
					query.setState(state => ({
						...state,
						isLoading: false,
					}));
					query.tempFetch = null;
				}
			})();

			return query.tempFetch;
		},
	};
	query.state.refetch = query.fetch;
	return query;
};

export class QueryClient<T> {
	queries: Map<string, Query<T>>;
	gcTime: number;

	constructor({ gcTime = 0 }: QueryClientProps = {}) {
		this.queries = new Map<string, Query<T>>();
		this.gcTime = gcTime;
	}

	removeObsolete = () => {
		if (!this.gcTime) return;
		const queryHashList = [...this.queries].map(([queryHash]) => queryHash);
		queryHashList.forEach(queryHash => {
			const query = this.queries.get(queryHash);
			if (query?.state.status === QueryStatus.Success && Date.now() - query.state.lastUpdated > this.gcTime) {
				this.queries.delete(queryHash);
			}
		});
	};

	getQuery = ({ queryFn, queryKey, keepPreviousData }: GetQuery) => {
		this.removeObsolete();

		const queryHash = JSON.stringify(queryKey);

		if (!this.queries.has(queryHash)) {
			const newQuery = createQuery<T>({
				queryKey,
				queryFn,
				previousData: keepPreviousData
					? this.queries.get(getPreviousQueryKeyHash(queryKey))?.state.data
					: undefined,
			});
			this.queries.set(queryHash, newQuery);
		}

		return this.queries.get(queryHash)!;
	};

	setQueryData = (queryKey: QueryKey, predicate: (arg: any) => QueryState<T>) => {
		const queryHash = JSON.stringify(queryKey);
		const setState = this.queries.get(queryHash)?.setState;
		if (!setState) return;
		setState(predicate);
	};

	invalidateQueries = ({ queryKey }: { queryKey: QueryKey }, data?: T) => {
		const updatedQueryKeys = [...this.queries.keys()].filter(key =>
			isEqual(this.queries.get(key)?.queryKey || [], queryKey)
		);

		const updatedMap = new Map<string, Query<T>>();

		updatedQueryKeys.forEach(key => {
			const query = this.queries.get(key);
			if (!query) return;
			if (data) {
				query.setState(state => ({
					...state,
					status: QueryStatus.Success,
					data,
					lastUpdated: Date.now(),
					error: undefined,
				}));
			} else {
				query.fetch();
			}
			updatedMap.set(key, query);
		});
		this.queries = new Map([...this.queries, ...updatedMap]);
	};
}
