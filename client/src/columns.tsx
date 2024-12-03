import { ColumnDef } from '@tanstack/react-table';
import { Device } from '@/types.ts';
import { NameInput } from '@/components/NameInput.tsx';
import { ModeManger } from '@/components/ModeManager.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { DeleteManager } from '@/components/DeleteManager.tsx';
import { AnimatedState } from '@/components/AnimatedState.tsx';

export const columns: ColumnDef<Device>[] = [
	{
		id: 'select-col',
		size: 30,
		header: ({ table }) => <DeleteManager table={table} />,
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				disabled={!row.getCanSelect()}
				onCheckedChange={row.getToggleSelectedHandler()}
			/>
		),
	},
	{
		accessorKey: 'id',
		header: 'ID',
		cell: ({ row }) => <AnimatedState text={row.getValue('id')} />,
	},
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => <NameInput cellName={row.getValue('name')} deviceId={row.getValue('id')} />,
	},
	{
		accessorKey: 'type',
		header: 'Type',
		cell: ({ row }) => <AnimatedState text={row.getValue('type')} />,
	},
	{
		accessorKey: 'state',
		header: 'State',
		cell: ({ row }) => (
			<AnimatedState
				text={row.getValue('state')}
				className="font-semibold"
				isError={row.getValue('state') === 'error'}
				errorClassName="text-red-400"
			/>
		),
	},
	{
		accessorKey: 'mode',
		header: () => <p className="pl-10">Manage device mode</p>,
		cell: ({ row }) => <ModeManger deviceId={row.getValue('id')} state={row.getValue('state')} />,
	},
];
