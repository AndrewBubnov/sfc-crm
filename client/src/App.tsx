import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AccountData } from '@/components/AccountData.tsx';
import { DataTable } from '@/components/DataTable.tsx';
import { Toaster } from '@/components/ui/toaster';
import { Statistics } from '@/components/Statistics.tsx';
import { StatisticsProvider } from '@/providers/StatisticsProvider.tsx';
import { FilteringProvider } from '@/providers/FilteringProvider.tsx';
import { PaginatedDataProvider } from '@/providers/PaginatedDataProvider.tsx';
import { TableProvider } from '@/providers/TableProvider.tsx';
import { TableControls } from '@/components/TableControls.tsx';
import { LimitManager } from '@/components/LimitManager.tsx';
import { Pagination } from '@/components/Pagination.tsx';

const queryClient = new QueryClient();

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<FilteringProvider>
				<StatisticsProvider>
					<PaginatedDataProvider>
						<div className="flex flex-col p-4">
							<div className="flex justify-between">
								<Statistics />
								<AccountData />
							</div>
							<div className="flex flex-col gap-2">
								<TableProvider>
									<TableControls />
									<DataTable />
								</TableProvider>
								<div className="flex items-center justify-end gap-8">
									<LimitManager />
									<Pagination />
								</div>
							</div>
						</div>
					</PaginatedDataProvider>
				</StatisticsProvider>
			</FilteringProvider>
			<Toaster />
		</QueryClientProvider>
	);
};

export default App;
