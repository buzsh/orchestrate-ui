"use client";

import React from 'react';
import { GrGraphQl } from "react-icons/gr";

const TopHeader: React.FC = () => {
  return (
    <header className="h-11 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 flex items-center px-4">
      <div className="flex items-center">
        <GrGraphQl className="text-blue-500 dark:text-blue-400 mr-2" />
        <h1 className="text-xl font-bold">
          <span className="text-black dark:text-white">Orchestrate</span>
          <span className="text-blue-500 dark:text-blue-400">UI</span>
        </h1>
      </div>
    </header>
  );
}

export default TopHeader;
