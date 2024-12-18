import { useContext } from 'react';
import { TableContext } from '@/providers/TableContext.ts';
import { Checkbox } from '@/ui/checkbox.tsx';
import { Row } from '@tanstack/react-table';
import { Device } from '@/types.ts';
import { useIsMutating } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { MutationKeys } from '@/modules/shared/queryKeys.ts';

type RowDeleteCheckboxProps = {
	row: Row<Device>;
};

export const RowDeleteCheckbox = ({ row }: RowDeleteCheckboxProps) => {
	const { deletedIdsList } = useContext(TableContext);
	const isMutating = Boolean(useIsMutating({ mutationKey: [MutationKeys.Delete] }));
	const isDeleting = isMutating && deletedIdsList.includes(row.original.id);

	return (
		<div className="flex justify-center">
			{isDeleting && <Loader className="animate-spin w-4 h-4" />}
			{!isDeleting && (
				<Checkbox
					className="checkbox-inverted"
					checked={row.getIsSelected()}
					disabled={!row.getCanSelect()}
					onCheckedChange={row.getToggleSelectedHandler()}
				/>
			)}
		</div>
	);
};
