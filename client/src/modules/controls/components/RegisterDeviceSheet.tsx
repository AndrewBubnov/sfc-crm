import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/ui/sheet.tsx';
import { Button } from '@/ui/button.tsx';
import { RegisterDeviceForm } from '@/modules/controls/components/RegisterDeviceForm.tsx';
import { Plus } from 'lucide-react';
import { useGetQueryDetails } from '@/modules/shared/hooks/useGetQueryDetails.ts';

export const RegisterDeviceSheet = () => {
	const { isFetching: isDevicesListUpdated } = useGetQueryDetails();

	return (
		<Sheet>
			<SheetTrigger asChild className="bg-transparent hover:border-transparent">
				<Button variant="ghost" disabled={isDevicesListUpdated}>
					<Plus />
					Register device
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Register new device</SheetTitle>
					<SheetDescription>
						Type the name of new device or check the auto name generate checkbox
					</SheetDescription>
				</SheetHeader>
				<RegisterDeviceForm isDevicesListUpdated={isDevicesListUpdated} />
			</SheetContent>
		</Sheet>
	);
};
