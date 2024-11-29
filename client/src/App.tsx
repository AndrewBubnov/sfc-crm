import { AccountData } from '@/components/AccountData.tsx';
import { DataTable } from '@/components/DataTable.tsx';
import { Toaster } from '@/components/ui/toaster';
import { Statistics } from '@/components/Statistics.tsx';
import { StatisticsProvider } from '@/providers/StatisticsProvider.tsx';
import { FilteringProvider } from '@/providers/FilteringProvider.tsx';
import { QueryClient, QueryProvider } from '@/react-mini-query';

const queryClient = new QueryClient();

const App = () => {
	return (
		<QueryProvider client={queryClient}>
			<FilteringProvider>
				<StatisticsProvider>
					<div className="flex flex-col p-4">
						<div className="flex justify-between">
							<Statistics />
							<AccountData />
						</div>
						<DataTable />
					</div>
				</StatisticsProvider>
			</FilteringProvider>
			<Toaster />
		</QueryProvider>
	);
};

export default App;
