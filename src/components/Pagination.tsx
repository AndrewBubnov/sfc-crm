import { Button } from '@/components/ui/button.tsx';
import { usePaginatedDeviceListData } from '@/hooks/usePaginatedDeviceListData.ts';
import { ChevronLeft, ChevronRight, ChevronFirst, ChevronLast } from 'lucide-react';
import { Skeleton } from '@/components/Skeleton.tsx';

type PaginationProps = {
	paginationData: ReturnType<typeof usePaginatedDeviceListData>['paginationData'];
	isLoading: boolean;
};

export const Pagination = ({
	paginationData: { page, setPage, setNextPage, setPrevPage, isPrevStepDisabled, isNextStepDisabled, lastPage },
	isLoading,
}: PaginationProps) => {
	const renderPagesList = () => {
		if (page === 1) return [1, 2, 3];
		if (page === lastPage) return [lastPage - 2, lastPage - 1, lastPage];
		return [page - 1, page, page + 1];
	};
	return (
		<div className="flex items-center justify-end space-x-4">
			<Skeleton isLoading={isLoading} className="w-[95vw] h-8 rounded-md">
				<div className="flex items-center">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setPage(1)}
						disabled={page === 1}
						className="bg-transparent hover:border-transparent"
					>
						<ChevronFirst />
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={setPrevPage}
						disabled={isPrevStepDisabled}
						className="bg-transparent hover:border-transparent"
					>
						<ChevronLeft />
					</Button>
				</div>
				<div className="flex items-center gap-4">
					{renderPagesList().map(pageIndex => {
						if (pageIndex === page)
							return (
								<span
									key={pageIndex}
									className="text-lg cursor-pointer font-semibold"
									onClick={() => setPage(pageIndex)}
								>
									{pageIndex}
								</span>
							);
						return (
							<span key={pageIndex} className="cursor-pointer text-xs" onClick={() => setPage(pageIndex)}>
								{pageIndex}
							</span>
						);
					})}
				</div>
				<div className="flex items-center">
					<Button
						variant="ghost"
						size="sm"
						onClick={setNextPage}
						disabled={isNextStepDisabled}
						className="bg-transparent hover:border-transparent"
					>
						<ChevronRight />
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setPage(lastPage)}
						disabled={page === lastPage}
						className="bg-transparent hover:border-transparent"
					>
						<ChevronLast />
					</Button>
				</div>
			</Skeleton>
		</div>
	);
};
