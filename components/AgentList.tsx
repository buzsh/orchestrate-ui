import React from "react";
import { Agent } from "@/data/types";
import { HiMagnifyingGlass, HiPlus } from "react-icons/hi2";
import { useScrollPosition } from "@/hooks/useScrollPosition";

interface AgentListProps {
  agents: Agent[];
  selectedAgentId: number | null;
  onSelectAgent: (agentId: number) => void;
  onCreateAgent: () => void;
  selectedWorkflowName: string | null;
}

const AgentList: React.FC<AgentListProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent,
  onCreateAgent,
  selectedWorkflowName,
}) => {
  const { scrollRef, handleScroll } = useScrollPosition(`agent-list-${selectedWorkflowName}`);

  return (
    <div 
      ref={scrollRef}
      onScroll={handleScroll}
      className={`w-full md:w-96 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-[#000] overflow-y-auto h-full flex flex-col ${
        selectedAgentId ? 'hidden md:block' : ''
      }`}
    >
      <div className="p-4 flex-1 min-h-0">
        <div className="flex justify-between items-center mb-4">
          <div className="relative flex-1">
            <div className="relative flex items-center">
              <HiMagnifyingGlass className="absolute left-2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search agents..."
                className="w-full bg-transparent py-2 pl-8 pr-2 text-[16px] placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0 dark:text-white"
              />
            </div>
          </div>
          <button
            onClick={onCreateAgent}
            className="ml-2 p-2 text-blue-500 hover:text-blue-600"
          >
            <HiPlus className="w-5 h-5" />
          </button>
        </div>

        <div className="relative pt-2 pb-2">
          <ul className="space-y-6 relative z-10">
            {agents.map((agent, index) => (
              <li key={agent.id} className="relative">
                {index !== 0 && (
                  <div className="absolute left-1/2 -top-[24px] h-[20px] w-0.5 bg-gradient-to-b from-blue-200 to-blue-400 dark:from-blue-800 dark:to-blue-600 transform -translate-x-1/2 z-0" />
                )}
                
                {index !== agents.length - 1 && (
                  <div className="absolute left-1/2 -bottom-[24px] h-[20px] w-0.5 bg-gradient-to-b from-blue-400 to-blue-200 dark:from-blue-600 dark:to-blue-800 transform -translate-x-1/2 z-0" />
                )}
                
                <button
                  onClick={() => onSelectAgent(agent.id)}
                  className={`
                    w-full text-left p-4 rounded-lg
                    relative z-10
                    transition-all duration-200 ease-in-out
                    bg-white dark:bg-black
                    border-2 border-blue-400/30 dark:border-blue-600/30
                    shadow-[0_0_15px_rgba(59,130,246,0.2)] dark:shadow-[0_0_15px_rgba(37,99,235,0.2)]
                    hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]
                    hover:border-blue-400/50 dark:hover:border-blue-600/50
                    ${
                      selectedAgentId === agent.id
                        ? "bg-blue-50 dark:bg-blue-900/30 border-blue-400 dark:border-blue-600 shadow-[0_0_25px_rgba(59,130,246,0.4)] dark:shadow-[0_0_25px_rgba(37,99,235,0.4)]"
                        : ""
                    }
                  `}
                >
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center">
                      <span className="text-[17px] font-semibold text-gray-900 dark:text-white">
                        {agent.name}
                      </span>
                      <span className="text-[14px] text-gray-500 dark:text-gray-400">
                        {agent.model}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-[14px] text-gray-600 dark:text-gray-300">
                        {agent.role}
                      </span>
                      <span className="text-[14px] text-gray-500 dark:text-gray-400">
                        T: {agent.temperature}
                      </span>
                    </div>
                    <p className="text-[14px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                      {agent.description}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AgentList; 
