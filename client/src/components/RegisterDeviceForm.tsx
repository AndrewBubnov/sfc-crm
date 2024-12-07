import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { useForm } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { registerDeviceSchema, RegisterDeviceSchemaType } from '@/schemas.ts';
import { DeviceMode, DeviceType } from '@/types.ts';

type RegisterDeviceFormProps = {
	onSubmit(form: RegisterDeviceSchemaType): void;
};

export const RegisterDeviceForm = ({ onSubmit }: RegisterDeviceFormProps) => {
	const form = useForm({
		resolver: zodResolver(registerDeviceSchema),
		defaultValues: {
			name: '',
			autoNameGenerate: false,
			type: DeviceType.Type1,
			state: DeviceMode.Off,
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Device name</FormLabel>
							<FormControl>
								<Input placeholder="Enter device name" type="text" {...field} />
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
							<Select onValueChange={field.onChange} defaultValue={field.value}>
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
							<Select onValueChange={field.onChange} defaultValue={field.value}>
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
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
};
