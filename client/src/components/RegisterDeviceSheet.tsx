import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet.tsx';
import { useToast } from '@/hooks/useToast.ts';
import { Button } from '@/components/ui/button.tsx';
import { RegisterDeviceForm } from '@/components/RegisterDeviceForm.tsx';
import { Plus } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { registerDevice } from '@/api/registerDevice.ts';
import { RegisterDeviceSchemaType } from '@/schemas.ts';
import { useGetQueryDetails } from '@/hooks/useGetQueryDetails.ts';

export const RegisterDeviceSheet = () => {
	const { toast } = useToast();

	const { isFetching } = useGetQueryDetails();

	const [isOpen, setIsOpen] = useState(false);

	const registerDeviceMutation = useMutation({ mutationFn: registerDevice });

	const onSubmit = (form: RegisterDeviceSchemaType) => {
		registerDeviceMutation.mutate(form, {
			onSuccess: data =>
				toast({ title: `Device '${data.data.name}', ID ${data.data.id}, has successfully been created` }),
		});
		setIsOpen(false);
	};

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild className="bg-transparent hover:border-transparent">
				<Button variant="ghost" disabled={registerDeviceMutation.isPending || isFetching}>
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
				<RegisterDeviceForm onSubmit={onSubmit} />
			</SheetContent>
		</Sheet>
	);
};
