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

        <ul className="space-y-1 overflow-y-auto pb-20">
          {agents.map((agent) => (
            <li key={agent.id}>
              <button
                onClick={() => onSelectAgent(agent.id)}
                className={`w-full text-left p-3 rounded-lg ${
                  selectedAgentId === agent.id
                    ? "bg-blue-100 dark:bg-blue-900"
                    : "hover:bg-gray-100 dark:hover:bg-[#2c2c2e]"
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <span className="text-[17px] font-semibold dark:text-white">
                      {agent.name}
                    </span>
                    <span className="text-[14px] text-gray-400">
                      {agent.model}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[14px] text-gray-500 dark:text-gray-400">
                      {agent.role}
                    </span>
                    <span className="text-[14px] text-gray-400">
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
  );
};

export default AgentList; 
