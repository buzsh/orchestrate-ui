"use client";

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import StartupList from './StartupList';
import DetailView from './DetailView';
import { Industry, Startup } from '@/data/types';
import { IoChevronBackOutline } from "react-icons/io5";
import { FaFolder, FaGlobe, FaInbox, FaEnvelope, FaPaperPlane, FaTrash } from 'react-icons/fa';

interface MobileLayoutProps {
  industries: Industry[];
  startups: Startup[];
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ industries, startups }) => {
  const router = useRouter();
  const params = useParams();
  
  const industryId = params.industry ? parseInt(params.industry as string) : null;
  const startupId = params.startup ? parseInt(params.startup as string) : null;

  const handleSelectIndustry = (newIndustryId: number | null) => {
    if (newIndustryId) {
      router.push(`/${newIndustryId}`);
    } else {
      router.push('/');
    }
  };

  const handleSelectStartup = (newStartupId: number) => {
    if (industryId) {
      router.push(`/${industryId}/${newStartupId}`);
    } else {
      router.push(`/all/${newStartupId}`);
    }
  };

  const handleBack = () => {
    if (startupId) {
      router.back();
    } else if (industryId) {
      router.back();
    }
  };

  const filteredStartups = industryId !== null
    ? industries.find(ind => ind.id === industryId)?.startups || []
    : startups;

  const selectedStartup = startupId
    ? startups.find(s => s.id === startupId) || null
    : null;

  const selectedIndustryName = industryId !== null
    ? industries.find(ind => ind.id === industryId)?.name || "All Industries"
    : "All Industries";

  // Determine which view to show based on URL params
  const currentView = startupId ? 'detail' : (industryId ? 'startups' : 'industries');

  return (
    <div className="h-full flex flex-col bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <header className="flex-none bg-gray-100 dark:bg-gray-900 p-4 flex items-center border-b border-gray-200 dark:border-gray-800">
        {currentView !== 'industries' && (
          <button onClick={handleBack} className="mr-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
            <IoChevronBackOutline className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-xl font-semibold">
          {currentView === 'industries' && 'Dashboard'}
          {currentView === 'startups' && selectedIndustryName}
          {currentView === 'detail' && selectedStartup?.name}
        </h1>
      </header>
      <main className="flex-1 min-h-0">
        {currentView === 'industries' && (
          <div className="h-full overflow-y-auto">
            <div className="p-4 space-y-8">
              <div>
                <h2 className="text-[21px] font-semibold text-gray-500 dark:text-gray-400 mb-4 pl-2 leading-[25px] tracking-[0.23px]">
                  Industries
                </h2>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => handleSelectIndustry(null)}
                      className="w-full flex items-center px-4 py-3 rounded-md text-[17px] font-normal tracking-[-0.24px] leading-[20px] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2c2c2e]"
                    >
                      <FaGlobe className="w-6 h-6 mr-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                      <span className="truncate">All Industries</span>
                    </button>
                  </li>
                  {industries.map((industry) => (
                    <li key={industry.id}>
                      <button
                        onClick={() => handleSelectIndustry(industry.id)}
                        className="w-full flex items-center px-4 py-3 rounded-md text-[17px] font-normal tracking-[-0.24px] leading-[20px] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2c2c2e]"
                      >
                        <FaFolder className="w-6 h-6 mr-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                        <span className="truncate">{industry.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h2 className="text-[21px] font-semibold text-gray-500 dark:text-gray-400 mb-4 pl-2 leading-[25px] tracking-[0.23px]">
                  Mailbox
                </h2>
                <ul className="space-y-2">
                  {[
                    { icon: FaInbox, name: "Inbox" },
                    { icon: FaEnvelope, name: "Drafts" },
                    { icon: FaPaperPlane, name: "Sent" },
                    { icon: FaTrash, name: "Trash" },
                  ].map((item, index) => (
                    <li key={index}>
                      <button className="w-full flex items-center px-4 py-3 rounded-md text-[17px] font-normal tracking-[-0.24px] leading-[20px] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2c2c2e]">
                        <item.icon className="w-6 h-6 mr-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        {currentView === 'startups' && (
          <div className="h-full">
            <StartupList
              startups={filteredStartups}
              selectedStartupId={startupId}
              onSelectStartup={handleSelectStartup}
              selectedIndustryName={selectedIndustryName}
            />
          </div>
        )}
        {currentView === 'detail' && (
          <div className="h-full">
            <DetailView startup={selectedStartup} />
          </div>
        )}
      </main>
    </div>
  );
};

export default MobileLayout;
