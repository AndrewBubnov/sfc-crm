import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover.tsx';
import { Trash, Ellipsis } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { Device } from '@/types.ts';
import { Checkbox } from '@/ui/checkbox.tsx';
import { useMutation } from '@tanstack/react-query';
import { deleteDevices } from '@/modules/table/api/deleteDevices.ts';
import { LoaderButton } from '@/modules/shared/components/LoaderButton.tsx';
import { Label } from '@/ui/label.tsx';
import { cn } from '@/lib/utils.ts';
import { useToast } from '@/modules/shared/hooks/useToast.ts';

import { getDeleteToastMessage } from '@/modules/table/utils.ts';

type DeleteManagerProps = {
	table: Table<Device>;
};

export const DeleteManager = ({ table }: DeleteManagerProps) => {
	const { toast } = useToast();
	const { mutate, isPending } = useMutation({ mutationFn: deleteDevices });
	const multiRowChecker = table.getToggleAllPageRowsSelectedHandler();
	const deletedDevicesIds = table.getSelectedRowModel().rows.map(row => row.original.id);
	const allRowsSelected = table.getIsAllRowsSelected();

	const deleteHandler = () => {
		mutate(
			{ ids: deletedDevicesIds },
			{
				onSuccess: ({ data }) =>
					toast({
						title: getDeleteToastMessage(data),
					}),
			}
		);
		table.resetRowSelection();
	};

	return (
		<Popover>
			<PopoverTrigger className="flex justify-center w-full bg-transparent border-none hover:border-none focus:outline-none">
				<Ellipsis />
			</PopoverTrigger>
			<PopoverContent className="flex flex-col gap-1 w-fit" side="top">
				<Label
					onClick={evt => isPending && evt.preventDefault()}
					className={cn(
						'flex items-center justify-start gap-2 cursor-pointer py-2 px-4 font-normal rounded-lg hover:bg-secondary',
						isPending && 'opacity-45'
					)}
				>
					<Checkbox
						className="checkbox-inverted"
						checked={allRowsSelected}
						onCheckedChange={evt => multiRowChecker({ target: { value: evt } })}
					/>
					<span>All rows</span>
				</Label>
				<LoaderButton
					isLoading={isPending}
					disabled={!deletedDevicesIds.length || isPending}
					onClick={deleteHandler}
					className={cn('flex items-center  gap-2', isPending ? 'justify-center' : 'justify-start')}
				>
					<Trash size={18} />
					<span>Delete selected rows</span>
				</LoaderButton>
			</PopoverContent>
		</Popover>
	);
};
