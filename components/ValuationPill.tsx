import React from 'react';
import { formatCurrency } from '@/utils/formatCurrency';
import { FundingRoundType } from '@/data/types';

interface ValuationPillProps {
  valuation: number;
  amountRaised: number;
  fundingRoundType: FundingRoundType;
}

const getColorClasses = (percentage: number, fundingRoundType: FundingRoundType): string => {
  const ranges = {
    'Pre-Seed': { veryBad: 30, slightlyBad: 25, common: 10, slightlyGood: 5 },
    'Seed': { veryBad: 30, slightlyBad: 25, common: 10, slightlyGood: 5 },
    'Series A': { veryBad: 30, slightlyBad: 25, common: 15, slightlyGood: 10 },
    'Series B': { veryBad: 25, slightlyBad: 20, common: 10, slightlyGood: 5 },
    'Series C': { veryBad: 20, slightlyBad: 15, common: 5, slightlyGood: 3 },
    'Series D': { veryBad: 15, slightlyBad: 10, common: 5, slightlyGood: 3 },
    'Series E': { veryBad: 15, slightlyBad: 10, common: 5, slightlyGood: 3 },
    'Series F': { veryBad: 15, slightlyBad: 10, common: 5, slightlyGood: 3 },
    'Series G': { veryBad: 15, slightlyBad: 10, common: 5, slightlyGood: 3 },
    'Series H': { veryBad: 15, slightlyBad: 10, common: 5, slightlyGood: 3 },
  };

  const range = ranges[fundingRoundType] || ranges['Series D'];

  if (percentage > range.veryBad) {
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
  } else if (percentage > range.slightlyBad) {
    return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
  } else if (percentage > range.common) {
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
  } else if (percentage > range.slightlyGood) {
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
  } else {
    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100';
  }
};

const ValuationPill: React.FC<Omit<ValuationPillProps, 'isDarkMode'>> = ({ valuation, amountRaised, fundingRoundType }) => {
  const percentage = (amountRaised / valuation) * 100;
  const colorClasses = getColorClasses(percentage, fundingRoundType);

  return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${colorClasses}`}>
      {formatCurrency(valuation)} / {percentage.toFixed(1)}%
    </span>
  );
};

export default ValuationPill;
