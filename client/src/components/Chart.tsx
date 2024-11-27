import { GraphData } from '@/types.ts';
import { Pie, PieChart } from 'recharts';
import { capitalize } from '@/utils.ts';

type ChartProps = {
	data: GraphData[];
	name: string;
	total: number;
	dto: Record<string, string>;
};

export const Chart = ({ data, dto, total, name }: ChartProps) => (
	<div className="flex">
		<PieChart width={300} height={180}>
			<Pie
				data={data}
				dataKey="value"
				nameKey="name"
				cx="50%"
				cy="50%"
				innerRadius={50}
				outerRadius={60}
				label={({ name }) => name}
				cornerRadius={4}
			/>
		</PieChart>
		<div className="flex flex-col gap-2 justify-center">
			<p className="font-semibold">{capitalize(name)}</p>
			{data
				.filter(el => el.name !== 'total' && el.name !== 'rest')
				.map(element => (
					<p key={element.name} style={{ color: dto[element.name] }}>
						{capitalize(element.name)}: {element.value}
					</p>
				))}
			<p>Total: {total}</p>
		</div>
	</div>
);
