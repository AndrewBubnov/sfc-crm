import { ColumnDef } from '@tanstack/react-table';
import { Device } from '@/types.ts';
import { NameInput } from '@/components/NameInput.tsx';
import { cn } from '@/lib/utils.ts';
import { ModeManger } from '@/components/ModeManager.tsx';
import { SortSwitch } from '@/components/SortSwitch.tsx';

type CreateColumn = {
	sortBy: string;
	sortDesc: boolean;
	onSortChange(arg: { sortedBy: string; sortedDesc: boolean }): void;
};

export const createColumns = ({ sortBy, sortDesc, onSortChange }: CreateColumn): ColumnDef<Device>[] => [
	{
		accessorKey: 'id',
		header: () => <SortSwitch id="id" onSortChange={onSortChange} sortBy={sortBy} sortDesc={sortDesc} />,
	},
	{
		accessorKey: 'name',
		header: () => <SortSwitch id="name" onSortChange={onSortChange} sortBy={sortBy} sortDesc={sortDesc} />,
		cell: ({ row }) => <NameInput cellName={row.getValue('name')} deviceId={row.getValue('id')} />,
	},
	{
		accessorKey: 'type',
		header: () => <SortSwitch id="type" onSortChange={onSortChange} sortBy={sortBy} sortDesc={sortDesc} />,
	},
	{
		accessorKey: 'state',
		header: () => <SortSwitch id="state" onSortChange={onSortChange} sortBy={sortBy} sortDesc={sortDesc} />,
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
