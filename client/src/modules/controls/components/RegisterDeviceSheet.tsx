import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/ui/sheet.tsx';
import { useToast } from '@/modules/shared/hooks/useToast.ts';
import { Button } from '@/ui/button.tsx';
import { RegisterDeviceForm } from '@/modules/controls/components/RegisterDeviceForm.tsx';
import { Plus } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { registerDevice } from '@/modules/table/api/registerDevice.ts';
import { RegisterDeviceSchemaType } from '@/modules/controls/schemas.ts';
import { useGetQueryDetails } from '@/modules/shared/hooks/useGetQueryDetails.ts';

export const RegisterDeviceSheet = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { toast } = useToast();
	const { isFetching } = useGetQueryDetails();
	const registerDeviceMutation = useMutation({ mutationFn: registerDevice });

	const onSubmit = (form: RegisterDeviceSchemaType) => {
		registerDeviceMutation.mutate(form, {
			onSuccess: data => {
				toast({ title: `Device '${data.data.name}', ID ${data.data.id}, has successfully been created` });
				setIsOpen(false);
			},
			onError: () =>
				toast({
					variant: 'destructive',
					title: 'Uh oh! Something went wrong with the creation of a new device',
					description: 'Please try again',
				}),
		});
	};

	const disabled = registerDeviceMutation.isPending || isFetching;

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild className="bg-transparent hover:border-transparent">
				<Button variant="ghost" disabled={disabled}>
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
				<RegisterDeviceForm onSubmit={onSubmit} disabled={disabled} />
			</SheetContent>
		</Sheet>
	);
};
