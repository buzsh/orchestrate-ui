import React from "react";
import { Startup } from "@/data/types";
import { formatCurrency } from "@/utils/formatCurrency";
import FundingRoundPill from "./FundingRoundPill";
import ValuationPill from "./ValuationPill";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useScrollPosition } from "@/hooks/useScrollPosition";

interface StartupListProps {
  startups: Startup[];
  selectedStartupId: number | null;
  onSelectStartup: (startupId: number) => void;
  selectedIndustryName: string | null;
}

const StartupList: React.FC<StartupListProps> = ({
  startups,
  selectedStartupId,
  onSelectStartup,
  selectedIndustryName,
}) => {
  const { scrollRef, handleScroll } = useScrollPosition(`startup-list-${selectedIndustryName}`);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const sortedStartups = [...startups].map(startup => {
    const sortedFundingRounds = [...startup.fundingRounds].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    return { ...startup, fundingRounds: sortedFundingRounds };
  }).sort((a, b) => {
    const dateA = a.fundingRounds[0]?.createdAt ? new Date(a.fundingRounds[0].createdAt) : new Date(0);
    const dateB = b.fundingRounds[0]?.createdAt ? new Date(b.fundingRounds[0].createdAt) : new Date(0);
    return dateB.getTime() - dateA.getTime(); // Descending order (newest first)
  });

  return (
    <div 
      ref={scrollRef}
      onScroll={handleScroll}
      className={`w-full md:w-96 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-[#000] overflow-y-auto h-full flex flex-col ${
        selectedStartupId ? 'hidden md:block' : ''
      }`}
    >
      <div className="p-4 flex-1 min-h-0">
        <div className="relative mb-4">
          <div className="relative flex items-center px-1">
            <HiMagnifyingGlass className="absolute left-2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent py-2 pl-8 text-[16px] placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0 dark:text-white select-none"
            />
          </div>
        </div>
        <ul className="space-y-1 overflow-y-auto pb-20">
          {sortedStartups.map((startup) => {
            const latestFundingRound = startup.fundingRounds[0];
            const aiSummary = latestFundingRound?.aiSummary?.content || "";
            return (
              <li key={startup.id}>
                <button
                  onClick={() => onSelectStartup(startup.id)}
                  className={`w-full text-left p-3 rounded-lg ${
                    selectedStartupId === startup.id
                      ? "bg-blue-100 dark:bg-blue-900"
                      : "hover:bg-gray-100 dark:hover:bg-[#2c2c2e]"
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center">
                      <span className="text-[17px] font-semibold tracking-[-0.37px] leading-[21px] truncate text-gray-900 dark:text-gray-100">
                        {startup.name}
                      </span>
                      {latestFundingRound && (
                        <span className="text-[14px] font-normal text-gray-400 dark:text-gray-500">
                          {formatDate(latestFundingRound.createdAt)}
                        </span>
                      )}
                    </div>
                    {latestFundingRound && (
                      <div className="flex items-center space-x-2 mt-1">
                        <FundingRoundPill type={latestFundingRound.type} />
                        <span className="text-[14px] font-bold tracking-[-0.22px] leading-[18px] text-gray-700 dark:text-gray-300">
                          {formatCurrency(latestFundingRound.amountRaised)}
                        </span>
                        {latestFundingRound.valuation && (
                          <>
                            <span className="text-[14px] tracking-[-0.22px] leading-[18px] text-gray-500 dark:text-gray-400">@</span>
                            <ValuationPill
                              valuation={latestFundingRound.valuation}
                              amountRaised={latestFundingRound.amountRaised}
                              fundingRoundType={latestFundingRound.type}
                            />
                          </>
                        )}
                      </div>
                    )}
                    <p className="text-[14px] tracking-[-0.22px] leading-[18px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                      {aiSummary}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default StartupList;
