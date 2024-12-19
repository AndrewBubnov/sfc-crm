import { useContext } from 'react';
import { Table } from '@tanstack/react-table';
import { TableContext } from '@/providers/TableContext.ts';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover.tsx';
import { useToast } from '@/modules/shared/hooks/useToast.ts';
import { useMutation } from '@tanstack/react-query';
import { deleteDevices } from '@/modules/table/api/deleteDevices.ts';
import { Button } from '@/ui/button.tsx';
import { Label } from '@/ui/label.tsx';
import { Checkbox } from '@/ui/checkbox.tsx';
import { Trash, Ellipsis, Loader } from 'lucide-react';
import { getDeleteToastMessage } from '@/modules/table/utils.ts';
import { cn } from '@/lib/utils.ts';
import { MutationKeys } from '@/modules/shared/queryKeys.ts';
import { Device } from '@/types.ts';

type DeleteManagerProps = {
	table: Table<Device>;
};

export const DeleteManager = ({ table }: DeleteManagerProps) => {
	const { toast } = useToast();
	const { setDeletedIdsList } = useContext(TableContext);
	const { mutate, isPending } = useMutation({
		mutationFn: deleteDevices,
		mutationKey: [MutationKeys.Delete],
	});
	const deletedDevicesIds = table.getSelectedRowModel().rows.map(row => row.original.id);
	const multiRowChecker = table.getToggleAllPageRowsSelectedHandler();
	const allRowsSelected = table.getIsAllRowsSelected();

	const deleteHandler = () => {
		setDeletedIdsList(deletedDevicesIds);
		mutate(
			{ ids: deletedDevicesIds },
			{
				onSuccess: ({ data }) => {
					setDeletedIdsList([]);
					toast({
						title: getDeleteToastMessage(data),
					});
				},
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
					<span>All page rows</span>
				</Label>
				<Button
					variant="ghost"
					disabled={!deletedDevicesIds.length || isPending}
					onClick={deleteHandler}
					className={cn('flex items-center justify-between font-normal')}
				>
					{isPending && <Loader className="animate-spin" />}
					{!isPending && <Trash size={18} />}
					<span>Delete selected rows</span>
				</Button>
			</PopoverContent>
		</Popover>
	);
};
