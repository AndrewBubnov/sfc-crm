import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { AccountData } from '@/modules/account/components/AccountData.tsx';
import { DataTable } from '@/modules/table/components/DataTable.tsx';
import { Toaster } from '@/ui/toaster';
import { Statistics } from '@/modules/statistics/components/Statistics.tsx';
import { StatisticsProvider } from '@/providers/StatisticsProvider.tsx';
import { TableProvider } from '@/providers/TableProvider.tsx';
import { TableControls } from '@/modules/controls/components/TableControls.tsx';
import { Pagination } from '@/modules/pagination/components/Pagination.tsx';

const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<Router>
			<StatisticsProvider>
				<div className="flex flex-col p-2 gap-2">
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
							<Pagination />
						</div>
					</div>
				</div>
			</StatisticsProvider>
			<Toaster />
		</Router>
	</QueryClientProvider>
);

export default App;
