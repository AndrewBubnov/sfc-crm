import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select.tsx';
import { Button } from '@/ui/button.tsx';
import { Input } from '@/ui/input.tsx';
import { useForm } from 'react-hook-form';
import { Checkbox } from '@/ui/checkbox.tsx';
import { registerDeviceSchema, RegisterDeviceSchemaType } from '@/modules/controls/schemas.ts';
import { DeviceMode, DeviceType } from '@/types.ts';
import { useMutation } from '@tanstack/react-query';
import { registerDevice } from '@/modules/table/api/registerDevice.ts';
import { useToast } from '@/modules/shared/hooks/useToast.ts';
import { Loader } from 'lucide-react';

type RegisterDeviceFormProps = {
	isDevicesListUpdated: boolean;
};

export const RegisterDeviceForm = ({ isDevicesListUpdated }: RegisterDeviceFormProps) => {
	const registerDeviceMutation = useMutation({ mutationFn: registerDevice });
	const { toast } = useToast();

	const disabled = isDevicesListUpdated || registerDeviceMutation.isPending;

	const form = useForm({
		resolver: zodResolver(registerDeviceSchema),
		defaultValues: {
			name: '',
			autoNameGenerate: false,
			type: DeviceType.Type1,
			state: DeviceMode.Off,
		},
	});

	const onSubmit = (formState: RegisterDeviceSchemaType) => {
		registerDeviceMutation.mutate(formState, {
			onSuccess: data =>
				toast({ title: `Device '${data.data.name}', ID ${data.data.id}, has successfully been created` }),
			onError: () =>
				toast({
					variant: 'destructive',
					title: 'Uh oh! Something went wrong with the creation of a new device',
					description: 'Please try again',
				}),
			onSettled: () => form.reset(),
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl py-10">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Device name</FormLabel>
							<FormControl>
								<Input placeholder="Enter device name" type="text" disabled={disabled} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="autoNameGenerate"
					render={({ field }) => (
						<FormItem className="flex flex-row items-start space-x-3 space-y-0">
							<FormControl>
								<Checkbox
									disabled={disabled}
									checked={field.value}
									onCheckedChange={async value => {
										field.onChange(value);
										await form.trigger('name');
									}}
								/>
							</FormControl>
							<div className="space-y-1 leading-none">
								<FormLabel>Or check to auto generate device name</FormLabel>
								<FormMessage />
							</div>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="type"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Device type</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder={DeviceType.Type1} />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{Object.values(DeviceType).map(type => (
										<SelectItem key={type} value={type}>
											{type}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="state"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Device initial state</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder={DeviceMode.Off} />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{Object.values(DeviceMode).map(state => (
										<SelectItem key={state} value={state}>
											{state}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex items-center gap-5">
					<Button type="submit" disabled={disabled}>
						Submit
					</Button>
					{registerDeviceMutation.isPending ? (
						<div className="flex items-center gap-3 text-sm">
							<Loader className="animate-spin w-4 h-4" />
							<span>New device is being registered</span>
						</div>
					) : null}
				</div>
			</form>
		</Form>
	);
};
