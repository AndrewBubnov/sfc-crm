import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet.tsx';
import { Button } from '@/components/ui/button.tsx';
import { RegisterDeviceForm } from '@/components/RegisterDeviceForm.tsx';
import { RegisterDeviceSchemaType } from '@/schemas.ts';
import { Plus } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { registerDevice } from '@/api/registerDevice.ts';

export const RegisterDeviceSheet = () => {
	const [isOpen, setIsOpen] = useState(false);
	const registerDeviceMutation = useMutation({ mutationFn: registerDevice });

	const onSubmit = (form: RegisterDeviceSchemaType) => {
		registerDeviceMutation.mutate(form);
		setIsOpen(false);
	};
	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild className="bg-transparent hover:border-transparent">
				<Button variant="ghost">
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
