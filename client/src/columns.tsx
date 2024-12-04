import { ColumnDef } from '@tanstack/react-table';
import { Device } from '@/types.ts';
import { NameInput } from '@/components/NameInput.tsx';
import { cn } from '@/lib/utils.ts';
import { ModeManger } from '@/components/ModeManager.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { DeleteManager } from '@/components/DeleteManager.tsx';

export const columns: ColumnDef<Device>[] = [
	{
		id: 'select-col',
		size: 25,
		header: ({ table }) => <DeleteManager table={table} />,
		cell: ({ row }) => (
			<div className="flex justify-center">
				<Checkbox
					className="checkbox-inverted"
					checked={row.getIsSelected()}
					disabled={!row.getCanSelect()}
					onCheckedChange={row.getToggleSelectedHandler()}
				/>
			</div>
		),
	},
	{
		accessorKey: 'id',
		header: 'ID',
	},
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => <NameInput cellName={row.getValue('name')} deviceId={row.getValue('id')} />,
	},
	{
		accessorKey: 'type',
		header: 'Type',
	},
	{
		accessorKey: 'state',
		header: 'State',
		cell: ({ row }) => {
			const state = row.getValue('state') as string;
			return <p className={cn('font-semibold', state === 'error' && 'text-red-400')}>{state}</p>;
		},
	},
	{
		accessorKey: 'mode',
		header: () => <p className="pl-10">Manage device mode</p>,
		cell: ({ row }) => <ModeManger deviceId={row.getValue('id')} state={row.getValue('state')} />,
	},
];
