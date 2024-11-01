import React from 'react';
import { FundingRoundType } from '@/data/types';

interface FundingRoundPillProps {
  type: FundingRoundType;
}

const pillColors = {
  'Pre-Seed': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100',
  'Seed': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  'Series A': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  'Series B': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  'Series C': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  'Series D': 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
  'Series E': 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
  'Series F': 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
  'Series G': 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
  'Series H': 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
};

const FundingRoundPill: React.FC<FundingRoundPillProps> = ({ type }) => {
  const colorClasses = pillColors[type] || 'bg-gray-200 text-gray-800';

  return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${colorClasses}`}>
      {type.toUpperCase()}
    </span>
  );
};

export default FundingRoundPill;
