import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { FundingRound, FundingRoundType } from '@/data/types';
import { formatCurrency } from '@/utils/formatCurrency';

interface FundingHistoryGraphProps {
  fundingRounds: FundingRound[];
}

const pillColors = {
  'Pre-Seed': '#FED7E2',
  'Seed': '#FEF3C7',
  'Series A': '#DBEAFE',
  'Series B': '#D1FAE5',
  'Series C': '#E9D5FF',
  'Series D': '#E5E7EB',
  'Series E': '#E5E7EB',
  'Series F': '#E5E7EB',
  'Series G': '#E5E7EB',
  'Series H': '#E5E7EB',
};

const FundingHistoryGraph: React.FC<FundingHistoryGraphProps> = ({ fundingRounds }) => {
  const sortedRounds = [...fundingRounds].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const data = sortedRounds.reduce((acc, round, index) => {
    const previousTotal = index > 0 ? acc[index - 1].cumulativeFunding : 0;
    return [...acc, {
      name: round.type,
      date: new Date(round.date).toLocaleDateString(),
      roundAmount: round.amountRaised,
      cumulativeFunding: previousTotal + round.amountRaised,
      valuation: round.valuation || null,
      pillColor: pillColors[round.type as FundingRoundType]
    }];
  }, [] as Array<{
    name: FundingRoundType;
    date: string;
    roundAmount: number;
    cumulativeFunding: number;
    valuation: number | null;
    pillColor: string;
  }>);

  const CustomTooltip = ({
    active,
    payload,
    label
  }: {
    active?: boolean;
    payload?: Array<{
      payload: {
        date: string;
        roundAmount: number;
        cumulativeFunding: number;
        valuation: number | null;
      };
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-bold">{label} - {payload[0]?.payload.date}</p>
          <p className="text-blue-500">
            Round Amount: {formatCurrency(payload[0]?.payload.roundAmount)}
          </p>
          <p className="text-blue-700">
            Total Funding: {formatCurrency(payload[0]?.payload.cumulativeFunding)}
          </p>
          {payload[0]?.payload.valuation && (
            <p className="text-green-600">
              Valuation: {formatCurrency(payload[0]?.payload.valuation)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px] text-gray-900 dark:text-gray-100">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
          />
          <YAxis
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          <Line
            type="monotone"
            dataKey="cumulativeFunding"
            name="Cumulative Funding"
            stroke="#4299E1"
            strokeWidth={2}
            dot={{
              r: 6,
              fill: "#4299E1",
              stroke: "#4299E1", 
              strokeWidth: 2
            }}
          />
          <Line
            type="monotone"
            dataKey="valuation"
            name="Valuation"
            stroke="#48BB78"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{
              r: 6,
              fill: "#48BB78",
              stroke: "#48BB78",
              strokeWidth: 2
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FundingHistoryGraph;
