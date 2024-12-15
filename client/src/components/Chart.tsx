import { useCallback, useState } from 'react';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';
import { SearchX } from 'lucide-react';
import { cn } from '@/lib/utils.ts';
import { ActiveShape } from '@/components/ActiveShape.tsx';
import { capitalize } from '@/utils.ts';
import { GraphData } from '@/types.ts';
import { useQueryParams } from '@/hooks/useQueryParams.ts';

type ChartProps = {
	data: GraphData[];
	name: string;
	total: number;
	dto: Record<string, string>;
};

export const Chart = ({ data, dto, total, name }: ChartProps) => {
	const [activeIndex, setActiveIndex] = useState(0);
	const { setFilter } = useQueryParams();

	const clickHandler = useCallback(
		(evt: Record<'name', string>) => setFilter({ field: name, search: evt.name }),
		[name, setFilter]
	);

	const isFullData = data.length > 2;
	const isFilteredData = data.length === 2;

	return (
		<div className="flex">
			<div className="flex items-center justify-center w-[33vw]">
				<ResponsiveContainer height={220} width="100%">
					<PieChart>
						<Pie
							data={data}
							dataKey="value"
							nameKey="name"
							cx="50%"
							cy="50%"
							activeIndex={activeIndex}
							activeShape={ActiveShape}
							innerRadius={50}
							outerRadius={60}
							cornerRadius={4}
							onClick={isFullData ? clickHandler : undefined}
							className={cn(isFullData && 'cursor-pointer')}
							onMouseEnter={(_: unknown, index: number) => setActiveIndex(index)}
						/>
					</PieChart>
				</ResponsiveContainer>
				{isFilteredData && (
					<SearchX
						className="absolute z-50 text-gray-300 pl-1 cursor-pointer"
						onClick={() => setFilter({ field: name, search: '' })}
					/>
				)}
			</div>
			<div className="flex flex-col gap-2 justify-center text-sm">
				<p className="font-semibold">{capitalize(name)}</p>
				{data
					.filter(el => el.name !== 'total' && el.name !== 'rest')
					.map(element => (
						<p key={element.name} style={{ color: dto[element.name] }}>
							{capitalize(element.name)}: {element.value}
						</p>
					))}
				{isFullData && <p>Total: {total}</p>}
				{isFilteredData && (
					<p>
						{data.find(el => el.name !== 'rest')?.value} of {total} filtered
					</p>
				)}
			</div>
		</div>
	);
};
