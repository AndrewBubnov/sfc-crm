import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { Skeleton } from '@/components/Skeleton.tsx';
import { AccountDataType } from '@/types.ts';
import { getAccountData } from '@/api/getAccountData.ts';
import { QueryKeys } from '@/queryKeys.ts';
import { useQuery } from '@/react-mini-query';

export const AccountData = () => {
	const { data, isLoading } = useQuery<AccountDataType>({
		queryKey: [QueryKeys.Account],
		queryFn: getAccountData,
	});

	const fallback = (data?.data.name || '').split(' ').map(el => el.charAt(0).toUpperCase());

	return (
		<div className="flex justify-end">
			<Skeleton isLoading={isLoading} className="w-[150px] h-[84px]">
				<div className="flex flex-col gap-2 items-center w-fit">
					<Avatar>
						<AvatarImage src={data?.data.image} />
						<AvatarFallback>{fallback}</AvatarFallback>
					</Avatar>
					<div className="flex flex-col  items-center gap-1">
						<span className="text-xs font-semibold text-gray-600">{data?.data.name}</span>
						<span className="text-xs font-semibold text-gray-600">{data?.data.email}</span>
					</div>
				</div>
			</Skeleton>
		</div>
	);
};
