import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AccountData } from '@/components/AccountData.tsx';
import { DataTable } from '@/components/DataTable.tsx';
import { Toaster } from '@/components/ui/toaster';
import { Statistics } from '@/components/Statistics.tsx';

const queryClient = new QueryClient();

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<div className="flex flex-col gap-10 p-4">
				<div className="flex justify-between">
					<Statistics />
					<AccountData />
				</div>
				<DataTable />
			</div>
			<Toaster />
		</QueryClientProvider>
	);
};

export default App;
