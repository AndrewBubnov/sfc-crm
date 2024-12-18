import { ColumnDef } from '@tanstack/react-table';
import { Device } from '@/types.ts';
import { AnimatedNameInput } from '@/modules/table/components/AnimatedNameInput.tsx';
import { ModeManger } from '@/modules/table/components/ModeManager.tsx';
import { DeleteManager } from '@/modules/table/components/DeleteManager.tsx';
import { AnimatedState } from '@/modules/table/components/AnimatedState.tsx';
import { cn } from '@/lib/utils.ts';
import { NameInput } from '@/modules/table/components/NameInput.tsx';
import { RowDeleteCheckbox } from '@/modules/table/components/RowDeleteCheckbox.tsx';

export const animatedColumns: ColumnDef<Device>[] = [
	{
		id: 'select-col',
		size: 25,
		header: ({ table }) => <DeleteManager table={table} />,
		cell: ({ row }) => <RowDeleteCheckbox row={row} />,
	},
	{
		accessorKey: 'id',
		header: 'ID',
		cell: ({ row }) => <AnimatedState text={row.getValue('id')} />,
	},
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => <AnimatedNameInput cellName={row.getValue('name')} deviceId={row.getValue('id')} />,
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

export const columns: ColumnDef<Device>[] = [
	{
		id: 'select-col',
		size: 25,
		header: ({ table }) => <DeleteManager table={table} />,
		cell: ({ row }) => <RowDeleteCheckbox row={row} />,
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
