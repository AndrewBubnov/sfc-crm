import { Button } from '@/components/ui/button.tsx';
import { usePaginatedDeviceListData } from '@/hooks/usePaginatedDeviceListData.ts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/Skeleton.tsx';

type PaginationProps = {
	paginationData: ReturnType<typeof usePaginatedDeviceListData>['paginationData'];
	isLoading: boolean;
};

export const Pagination = ({
	paginationData: { page, setNextPage, setPrevPage, isPrevStepDisabled, isNextStepDisabled },
	isLoading,
}: PaginationProps) => (
	<div className="flex items-center justify-end space-x-4">
		<Skeleton isLoading={isLoading} className="w-[95vw] h-8 rounded-md">
			<Button
				variant="outline"
				size="sm"
				onClick={setPrevPage}
				disabled={isPrevStepDisabled}
				className="hover:border-transparent"
			>
				<ChevronLeft />
				Previous
			</Button>
			<span>{page}</span>
			<Button
				variant="outline"
				size="sm"
				onClick={setNextPage}
				disabled={isNextStepDisabled}
				className="hover:border-transparent"
			>
				Next
				<ChevronRight />
			</Button>
		</Skeleton>
	</div>
);
