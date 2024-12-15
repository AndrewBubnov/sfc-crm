import { useContext, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet.tsx';
import { useToast } from '@/hooks/useToast.ts';
import { Button } from '@/components/ui/button.tsx';
import { RegisterDeviceForm } from '@/components/RegisterDeviceForm.tsx';
import { Plus } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { registerDevice } from '@/api/registerDevice.ts';
import { DataContext } from '@/providers/DataContext.ts';
import { RegisterDeviceSchemaType } from '@/schemas.ts';

export const RegisterDeviceSheet = () => {
	const { toast } = useToast();

	const { isFetching } = useContext(DataContext);

	const [isOpen, setIsOpen] = useState(false);

	const registerDeviceMutation = useMutation({ mutationFn: registerDevice });

	const onSubmit = (form: RegisterDeviceSchemaType) => {
		registerDeviceMutation.mutate(form, {
			onSuccess: () => toast({ title: `Device '${form.name}' has successfully been created` }),
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
				</SheetHeader>
				<RegisterDeviceForm onSubmit={onSubmit} />
			</SheetContent>
		</Sheet>
	);
};
