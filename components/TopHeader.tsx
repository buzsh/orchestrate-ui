"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaArrowTrendUp } from "react-icons/fa6";
import FundingRoundPill from './FundingRoundPill';
import ValuationPill from './ValuationPill';
import { FundingRoundType } from '@/data/types';
import { formatCurrency } from '@/utils/formatCurrency';

export interface TickerItem {
  id: number;
  name: string;
  latestFundingRound: {
    type: FundingRoundType;
    amountRaised: number;
    valuation: number | undefined;
  };
}

interface TopHeaderProps {
  tickerItems: TickerItem[];
}

const TopHeader: React.FC<TopHeaderProps> = ({ tickerItems }) => {
  const [isPaused, setIsPaused] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const adjustTickerContent = () => {
      if (tickerRef.current) {
        const containerWidth = tickerRef.current.offsetWidth;
        const contentWidth = tickerRef.current.scrollWidth / 2; // Divide by 2 because content is duplicated
        const repetitions = Math.ceil(containerWidth / contentWidth) + 1;
        
        tickerRef.current.style.setProperty('--repetitions', repetitions.toString());
      }
    };

    adjustTickerContent();
    window.addEventListener('resize', adjustTickerContent);

    return () => {
      window.removeEventListener('resize', adjustTickerContent);
    };
  }, [tickerItems]);

  const renderTickerContent = () => (
    <>
      {tickerItems.map((item, index) => (
        <React.Fragment key={item.id}>
          <span className="inline-flex items-center space-x-1 mx-4">
            <span className="font-bold text-black dark:text-white">{item.name}</span>
            <FundingRoundPill type={item.latestFundingRound.type} />
            <span className="font-bold text-black dark:text-white">
              {formatCurrency(item.latestFundingRound.amountRaised)}
            </span>
            <span className="text-gray-500 dark:text-gray-400">@</span>
            {item.latestFundingRound.valuation && (
              <ValuationPill
                valuation={item.latestFundingRound.valuation}
                amountRaised={item.latestFundingRound.amountRaised}
                fundingRoundType={item.latestFundingRound.type}
              />
            )}
          </span>
          {index < tickerItems.length - 1 && (
            <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
          )}
        </React.Fragment>
      ))}
    </>
  );

  return (
    <header className="h-11 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4">
      <div className="flex items-center">
        <FaArrowTrendUp className="text-blue-500 dark:text-blue-400 mr-2" />
        <h1 className="text-xl font-bold">
          <span className="text-black dark:text-white">Market</span>
          <span className="text-blue-500 dark:text-blue-400">Recon</span>
        </h1>
      </div>
      <div 
        className="flex-1 ml-4 ticker-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          ref={tickerRef}
          className={`ticker-content ${isPaused ? 'paused' : ''}`}
          style={{
            '--repetitions': '2',
            width: 'fit-content',
            display: 'flex',
          } as React.CSSProperties}
        >
          {renderTickerContent()}
          {renderTickerContent()} {/* Duplicate content for seamless looping */}
        </div>
      </div>
    </header>
  );
}

export default TopHeader;
