import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AccountData } from '@/components/AccountData.tsx';
import { DataTable } from '@/components/DataTable.tsx';
import { Toaster } from '@/components/ui/toaster';
import { Statistics } from '@/components/Statistics.tsx';
import { StatisticsProvider } from '@/providers/StatisticsProvider.tsx';
import { FilteringProvider } from '@/providers/FilteringProvider.tsx';
import { PaginatedDataProvider } from '@/providers/PaginatedDataProvider.tsx';
import { TableProvider } from '@/providers/TableProvider.tsx';

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
							<TableProvider>
								<DataTable />
							</TableProvider>
						</div>
					</PaginatedDataProvider>
				</StatisticsProvider>
			</FilteringProvider>
			<Toaster />
		</QueryClientProvider>
	);
};

export default App;
