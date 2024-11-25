import { useContext } from 'react';
import { GraphFillDto } from '@/constants.ts';
import { Pie, PieChart } from 'recharts';
import { capitalize } from '@/utils.ts';
import { StatisticsContext } from '@/providers/StatisticsContext.ts';

export const Statistics = () => {
	const { statistics, total } = useContext(StatisticsContext);
	const isLabelsRendered = statistics.length > 2;

	return (
		<div className="flex gap-2">
			<PieChart width={330} height={240}>
				<Pie
					data={statistics}
					dataKey="value"
					nameKey="name"
					cx="50%"
					cy="50%"
					innerRadius={60}
					outerRadius={80}
					label={isLabelsRendered ? entry => capitalize(entry.name) : undefined}
					cornerRadius={4}
				/>
			</PieChart>
			<div className="flex flex-col gap-6 justify-center">
				{statistics
					.filter(el => el.name !== 'total' && el.name !== 'rest')
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
