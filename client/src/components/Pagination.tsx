import { ChevronLeft, ChevronRight, ChevronFirst, ChevronLast } from 'lucide-react';
import { Skeleton } from '@/components/Skeleton.tsx';
import { createIndexesList } from '@/utils.ts';
import { useMemo } from 'react';
import { PaginationButton } from '@/components/PaginationButton.tsx';
import { usePagination } from '@/hooks/usePagination.ts';
import { useGetQueryDetails } from '@/hooks/useGetQueryDetails.ts';

export const Pagination = () => {
	const { setPage, setNextPage, setPrevPage, isPrevStepDisabled, isNextStepDisabled, page, lastPage } =
		usePagination();
	const { isInitFetching, isFetching } = useGetQueryDetails();
	const pageIndexes = createIndexesList(page, lastPage);

	const pagesList = useMemo(
		() =>
			pageIndexes.map(pageIndex => {
				if (pageIndex === page)
					return (
						<PaginationButton key={pageIndex} disabled={isFetching} className="text-lg font-semibold">
							<span>{pageIndex}</span>
						</PaginationButton>
					);
				return (
					<PaginationButton
						key={pageIndex}
						disabled={isFetching}
						className="text-xs"
						onClick={() => setPage(pageIndex)}
					>
						<span>{pageIndex}</span>
					</PaginationButton>
				);
			}),
		[isFetching, page, pageIndexes, setPage]
	);

	const isPaginationEnabled = pagesList.length > 1;

	return (
		<div className="flex items-center justify-end space-x-4">
			<Skeleton isLoading={isInitFetching} className="w-[25vw] h-8 rounded-md">
				{isPaginationEnabled && (
					<>
						<div className="flex items-center">
							<PaginationButton
								disabled={page === 1 || isFetching}
								onClick={() => setPage(1)}
								dataTestId="pagination-first-button"
							>
								<ChevronFirst />
							</PaginationButton>
							<PaginationButton
								disabled={isPrevStepDisabled || isFetching}
								onClick={setPrevPage}
								dataTestId="pagination-previous-button"
							>
								<ChevronLeft />
							</PaginationButton>
						</div>
						<div className="flex items-center">
							{pageIndexes[0] > 1 && (
								<PaginationButton disabled={isFetching} onClick={() => setPage(Math.max(page - 3, 1))}>
									...
								</PaginationButton>
							)}
							{pagesList}
							{(pageIndexes.at(-1) || 1) < lastPage && (
								<PaginationButton
									disabled={isFetching}
									onClick={() => setPage(Math.min(page + 3, lastPage))}
								>
									...
								</PaginationButton>
							)}
						</div>
						<div className="flex items-center">
							<PaginationButton
								disabled={isNextStepDisabled || isFetching}
								onClick={setNextPage}
								dataTestId="pagination-next-button"
							>
								<ChevronRight />
							</PaginationButton>
							<PaginationButton
								disabled={page === lastPage || isFetching}
								onClick={() => setPage(lastPage)}
								dataTestId="pagination-last-button"
							>
								<ChevronLast />
							</PaginationButton>
						</div>
					</>
				)}
			</Skeleton>
		</div>
	);
};
