import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet.tsx';
import { Button } from '@/components/ui/button.tsx';
import { RegisterDeviceForm } from '@/components/RegisterDeviceForm.tsx';
import { useDeviceRegister } from '@/hooks/useDeviceRegister.ts';
import { RegisterDeviceSchemaType } from '@/schemas.ts';
import { useState } from 'react';

export const RegisterDeviceSheet = () => {
	const [isOpen, setIsOpen] = useState(false);
	const registerDeviceMutation = useDeviceRegister();

	const onSubmit = (form: RegisterDeviceSchemaType) => {
		registerDeviceMutation(form);
		setIsOpen(false);
	};
	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger className="bg-transparent hover:border-transparent" asChild>
				<Button variant="outline" className="ml-auto">
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
