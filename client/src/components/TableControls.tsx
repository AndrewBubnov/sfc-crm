import { Skeleton } from '@/components/Skeleton.tsx';
import { RegisterDeviceSheet } from '@/components/RegisterDeviceSheet.tsx';
import { ClearFilters } from '@/components/ClearFilters.tsx';
import { ColumnManager } from '@/components/ColumnManager.tsx';
import { AnimationManager } from '@/components/AnimationManager.tsx';
import { useGetQueryDetails } from '@/hooks/useGetQueryDetails.ts';

export const TableControls = () => {
	const { isInitFetching } = useGetQueryDetails();
	return (
		<div className="flex items-center justify-between">
			<Skeleton isLoading={isInitFetching} className="w-full h-8 rounded-md">
				<div className="flex items-center gap-[100px]">
					<RegisterDeviceSheet />
					<AnimationManager />
					<ClearFilters />
				</div>
				<ColumnManager />
			</Skeleton>
		</div>
	);
};
