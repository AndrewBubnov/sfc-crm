import { useContext } from 'react';
import { StateGraphFillDto, TypeGraphFillDto } from '@/constants.ts';
import { Pie, PieChart } from 'recharts';
import { capitalize } from '@/utils.ts';
import { StatisticsContext } from '@/providers/StatisticsContext.ts';

export const Statistics = () => {
	const { stateStats, typeStats, total } = useContext(StatisticsContext);

	return (
		<div className="flex w-[70vw] justify-between">
			<div className="flex">
				<PieChart width={300} height={180}>
					<Pie
						data={stateStats}
						dataKey="value"
						nameKey="name"
						cx="50%"
						cy="50%"
						innerRadius={50}
						outerRadius={60}
						label={stateStats.length > 2 ? entry => capitalize(entry.name) : undefined}
						cornerRadius={4}
					/>
				</PieChart>
				<div className="flex flex-col gap-2 justify-center">
					{stateStats
						.filter(el => el.name !== 'total' && el.name !== 'rest')
						.map(element => (
							<p key={element.name} style={{ color: StateGraphFillDto[element.name] }}>
								{capitalize(element.name)}: {element.value}
							</p>
						))}
					<p>Total: {total}</p>
				</div>
			</div>
			<div className="flex">
				<PieChart width={300} height={180}>
					<Pie
						data={typeStats}
						dataKey="value"
						nameKey="name"
						cx="50%"
						cy="50%"
						innerRadius={50}
						outerRadius={60}
						label={stateStats.length > 2 ? entry => capitalize(entry.name) : undefined}
						cornerRadius={4}
					/>
				</PieChart>
				<div className="flex flex-col gap-2 justify-center">
					{typeStats
						.filter(el => el.name !== 'rest')
						.map(element => (
							<p key={element.name} style={{ color: TypeGraphFillDto[element.name] }}>
								{capitalize(element.name)}: {element.value}
							</p>
						))}
					<p>Total: {total}</p>
				</div>
			</div>
		</div>
	);
};
