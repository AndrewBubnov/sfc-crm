import { useEffect, useState } from 'react';

export const useDebounced = <T>(value: T[], resolver: (arg: T[]) => boolean = () => true, delay: number = 500) => {
	const [debouncedValue, setDebouncedValue] = useState<T[]>(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			if (resolver(value)) setDebouncedValue(value);
		}, delay);
		return () => clearTimeout(handler);
	}, [value, delay, resolver]);

	return debouncedValue;
};
