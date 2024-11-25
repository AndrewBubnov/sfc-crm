import { useEffect, useState } from 'react';
import { BASE_URL } from '@/constants.ts';
import { Pie, PieChart } from 'recharts';
import { capitalize } from '@/utils.ts';

type GraphData = {
	name: string;
	value: number;
	fill: string;
};

const GraphFillDto: Record<string, string> = {
	error: 'tomato',
	off: 'indigo',
	standby: 'limegreen',
	charging: 'green',
	all: 'lightgray',
};

export const Statistics = () => {
	const [data, setData] = useState<GraphData[]>([]);
	const [total, setTotal] = useState<number>(0);

	useEffect(() => {
		const eventSource = new EventSource(`${BASE_URL}/subscribe-device-changes`);
		const listener = (evt: MessageEvent) => {
			const { stats } = JSON.parse(evt.data);
			const total: number = stats.total;
			setTotal(total);
			delete stats.total;
			setData(() => {
				const keys = Object.keys(stats);
				if (keys.length === 1) {
					const [key] = keys;
					return [
						{ name: key, value: stats[key], fill: GraphFillDto[key] },
						{ name: 'total', value: total, fill: GraphFillDto['all'] },
					];
				}
				return keys.map(key => ({
					name: key,
					value: stats[key],
					fill: GraphFillDto[key],
				}));
			});
		};

		eventSource.addEventListener('connected', listener);
		eventSource.addEventListener('deviceCreated', listener);
		eventSource.addEventListener('deviceDeleted', listener);
		eventSource.addEventListener('deviceUpdate', listener);

		return () => {
			eventSource.close();
			eventSource.removeEventListener('connected', listener);
			eventSource.removeEventListener('deviceCreated', listener);
			eventSource.removeEventListener('deviceDeleted', listener);
			eventSource.removeEventListener('deviceUpdate', listener);
		};
	}, []);

	return (
		<div className="flex gap-2">
			<PieChart width={350} height={240}>
				<Pie
					data={data}
					dataKey="value"
					nameKey="name"
					cx="50%"
					cy="50%"
					innerRadius={60}
					outerRadius={80}
					label={entry => capitalize(entry.name)}
				/>
			</PieChart>
			<div className="flex flex-col gap-6 justify-center">
				{data
					.filter(el => el.name !== 'total')
					.map(element => (
						<p key={element.name} style={{ color: GraphFillDto[element.name] }}>
							{capitalize(element.name)}: {element.value}
						</p>
					))}
				<p>Total: {total}</p>
			</div>
		</div>
	);
};
