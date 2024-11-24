import z from 'zod';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Controller, useForm } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Label } from '@/components/ui/label.tsx';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormEvent, useCallback } from 'react';

const schema = z
	.object({
		name: z.string(),
		autoNameGenerate: z.boolean(),
	})
	.refine(
		data => {
			console.log('HERE');
			return data.autoNameGenerate || (data.name && data.name.trim() !== '');
		},
		{
			message: "'Name' field is required if 'auto generate name' is not selected",
			path: ['name'],
		}
	);

export const RegisterDevice = () => {
	const { trigger, control } = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			name: '',
			autoNameGenerate: false,
		},
	});

	const handleSubmit = useCallback(
		(evt: FormEvent) => {
			evt.preventDefault();
			trigger();
		},
		[trigger]
	);
	return (
		<Sheet>
			<SheetTrigger className="bg-transparent hover:border-transparent" asChild>
				<Button variant="outline" className="ml-auto">
					Register device
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Register new device</SheetTitle>
				</SheetHeader>
				<form className="flex flex-col gap-6 mt-12">
					<Label className="text-sm text-gray-800">
						Enter device name (optional)
						<Controller name="name" control={control} render={({ field }) => <Input {...field} />} />
					</Label>
					<div className="flex items-center space-x-2">
						<Controller
							control={control}
							render={({ field }) => (
								<div className="flex items-center gap-2">
									<Checkbox
										id="autoGenerate"
										onCheckedChange={() => field.onChange(!field.value)}
										checked={Boolean(field.value)}
									/>
									<Label
										htmlFor="autoGenerate"
										className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										Or check to auto generate device name
									</Label>
								</div>
							)}
							name="autoNameGenerate"
						/>
					</div>
					<Button type="submit" onClick={handleSubmit}>
						Register
					</Button>
				</form>
			</SheetContent>
		</Sheet>
	);
};
