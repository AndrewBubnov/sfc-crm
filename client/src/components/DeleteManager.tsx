import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { Trash, Ellipsis } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { Device } from '@/types.ts';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { useMutation } from '@tanstack/react-query';
import { deleteDevices } from '@/api/deleteDevices.ts';
import { Button } from '@/components/ui/button.tsx';
import { LoaderButton } from '@/components/LoaderButton.tsx';
import { Label } from '@/components/ui/label.tsx';

type DeleteManagerProps = {
	table: Table<Device>;
};

export const DeleteManager = ({ table }: DeleteManagerProps) => {
	const { mutate, isPending } = useMutation({ mutationFn: deleteDevices });
	const multiRowChecker = table.getToggleAllPageRowsSelectedHandler();

	const deleteHandler = () => {
		const deletedDevicesIds = table.getSelectedRowModel().rows.map(row => row.original.id);
		mutate({ ids: deletedDevicesIds });
		table.resetRowSelection();
	};

	return (
		<Popover>
			<PopoverTrigger className="bg-transparent border-none hover:border-none focus:outline-none">
				<Ellipsis />
			</PopoverTrigger>
			<PopoverContent className="flex flex-col gap-4 w-fit" side="top">
				<Button className="flex justify-start" variant="ghost" disabled={isPending}>
					<Label className="flex items-center gap-2">
						<Checkbox
							checked={table.getIsAllRowsSelected()}
							onCheckedChange={evt => multiRowChecker({ target: { value: evt } })}
						/>
						<span>Select all rows</span>
					</Label>
				</Button>
				<LoaderButton
					isLoading={isPending}
					disabled={isPending}
					onClick={deleteHandler}
					className="flex items-center justify-start gap-2"
				>
					<Trash size={18} />
					<span>Delete selected rows</span>
				</LoaderButton>
			</PopoverContent>
		</Popover>
	);
};
