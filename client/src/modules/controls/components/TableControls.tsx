import { Skeleton } from '@/modules/shared/components/Skeleton.tsx';
import { RegisterDeviceSheet } from '@/modules/controls/components/RegisterDeviceSheet.tsx';
import { ClearFilters } from '@/modules/controls/components/ClearFilters.tsx';
import { ColumnManager } from '@/modules/controls/components/ColumnManager.tsx';
import { AnimationManager } from '@/modules/controls/components/AnimationManager.tsx';
import { useGetQueryDetails } from '@/modules/shared/hooks/useGetQueryDetails.ts';
import { LimitManager } from '@/modules/controls/components/LimitManager.tsx';

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
				<div className="flex items-center gap-[100px]">
					<LimitManager />
					<ColumnManager />
				</div>
			</Skeleton>
		</div>
	);
};
