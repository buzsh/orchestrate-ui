import React, { useState, useEffect } from "react";
import { Startup, FundingRound } from "@/data/types";
import FundingRoundPill from "./FundingRoundPill";
import ValuationPill from "./ValuationPill";
import { formatCurrency } from "@/utils/formatCurrency";
import { HiOutlineLink, HiOutlineShare, HiOutlineGlobeAlt, HiOutlinePlusCircle, HiOutlineFlag } from "react-icons/hi2";
import FundingHistoryGraph from "./FundingHistoryGraph";

interface DetailViewProps {
  startup: Startup | null;
  fundingRoundId?: number;
}

const DetailView: React.FC<DetailViewProps> = ({ startup, fundingRoundId }) => {
  const [selectedFundingRound, setSelectedFundingRound] = useState<FundingRound | null>(null);

  useEffect(() => {
    if (startup) {
      const sortedFundingRounds = [...startup.fundingRounds].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      setSelectedFundingRound(sortedFundingRounds[0] || null);
    }
  }, [startup]);

  useEffect(() => {
    if (fundingRoundId && startup) {
      const foundRound = startup.fundingRounds.find(
        (round) => round.id === fundingRoundId
      );
      if (foundRound) {
        setSelectedFundingRound(foundRound);
      }
    }
  }, [fundingRoundId, startup]);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    // You might want to add a toast or some other feedback here
  };

  if (!startup) {
    return (
      <div className="flex-1 p-4 bg-white dark:bg-black text-gray-900 dark:text-gray-100">
        <p>Select a startup to view details.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h1 className="hidden md:block text-2xl font-bold">{startup.name}</h1>
          <div className="flex space-x-4 ml-auto">
            <button onClick={copyUrl} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <HiOutlineLink className="w-6 h-6" />
            </button>
            <button className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <HiOutlineShare className="w-6 h-6" />
            </button>
            <button className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <HiOutlineGlobeAlt className="w-6 h-6" />
            </button>
            <button className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <HiOutlinePlusCircle className="w-6 h-6" />
            </button>
            <button className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              <HiOutlineFlag className="w-6 h-6" />
            </button>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{startup.description}</p>
        <h2 className="text-xl font-semibold mb-4">Funding Rounds</h2>
        <ul className="mb-4 space-y-2">
          {startup.fundingRounds.map((round) => (
            <li key={round.id}>
              <button
                onClick={() => setSelectedFundingRound(round)}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                  selectedFundingRound?.id === round.id
                    ? "bg-gray-100 dark:bg-gray-800"
                    : "hover:bg-gray-50 dark:hover:bg-gray-900"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FundingRoundPill type={round.type} />
                  <span className="font-bold">{formatCurrency(round.amountRaised)}</span>
                </div>
                {round.valuation && (
                  <div className="flex items-center">
                    <span className="text-gray-500 dark:text-gray-400 mr-1">@</span>
                    <ValuationPill
                      valuation={round.valuation}
                      amountRaised={round.amountRaised}
                      fundingRoundType={round.type}
                    />
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>

        {selectedFundingRound && selectedFundingRound.aiSummary && (
          <div>
            <h3 className="text-lg font-semibold mb-2">AI Summary</h3>
            <p className="text-gray-700 dark:text-gray-300">{selectedFundingRound.aiSummary.content}</p>
          </div>
        )}

        {selectedFundingRound && selectedFundingRound.articles.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Articles</h3>
            {selectedFundingRound.articles.map((article) => (
              <details key={article.id} className="mb-2">
                <summary className="cursor-pointer text-gray-800 dark:text-gray-200">{article.title}</summary>
                <p className="mt-2 text-gray-700 dark:text-gray-300">{article.content}</p>
              </details>
            ))}
          </div>
        )}

        {startup.articles.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Other Articles</h3>
            {startup.articles.map((article) => (
              <details key={article.id} className="mb-2">
                <summary className="cursor-pointer text-gray-800 dark:text-gray-200">{article.title}</summary>
                <p className="mt-2 text-gray-700 dark:text-gray-300">{article.content}</p>
              </details>
            ))}
          </div>
        )}

        {startup.fundingRounds.length > 1 && (
          <div className="mt-8 mb-6">
            <h2 className="text-xl font-semibold mb-2">Funding History</h2>
            <FundingHistoryGraph fundingRounds={startup.fundingRounds} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailView;
