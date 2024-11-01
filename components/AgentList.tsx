import React, { useState, useEffect } from "react";
import { Agent } from "@/data/types";
import { HiMagnifyingGlass, HiPlus, HiOutlineCheck, HiTrash } from "react-icons/hi2";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import ConfirmDialog from "./ConfirmDialog";
import { useMutations } from '@/lib/hooks/useData';

interface AgentListProps {
  agents: Agent[];
  selectedAgentId: string | null;
  onSelectAgent: (agentId: string) => void;
  onCreateAgent: () => void;
  selectedWorkflowName: string | null;
  onSaveWorkflow?: (name: string) => void;
}

const AgentList: React.FC<AgentListProps> = ({
  agents = [],
  selectedAgentId,
  onSelectAgent,
  onCreateAgent,
  selectedWorkflowName,
  onSaveWorkflow,
}) => {
  const { scrollRef, handleScroll } = useScrollPosition(`agent-list-${selectedWorkflowName}`);
  const [editedWorkflowName, setEditedWorkflowName] = useState(selectedWorkflowName);
  const [agentToDelete, setAgentToDelete] = useState<string | null>(null);
  const { deleteAgent } = useMutations();

  const agentList = Array.isArray(agents) ? agents : [];

  useEffect(() => {
    setEditedWorkflowName(selectedWorkflowName);
  }, [selectedWorkflowName]);

  const handleWorkflowNameSave = () => {
    if (editedWorkflowName && onSaveWorkflow) {
      onSaveWorkflow(editedWorkflowName);
    }
  };

  const handleDeleteAgent = async () => {
    if (agentToDelete) {
      try {
        await deleteAgent.mutateAsync(agentToDelete);
        setAgentToDelete(null);
      } catch (error) {
        console.error('Failed to delete agent:', error);
      }
    }
  };

  return (
    <div 
      ref={scrollRef}
      onScroll={handleScroll}
      className={`w-full md:w-96 md:border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-[#000] overflow-y-auto h-full flex flex-col ${
        selectedAgentId ? 'hidden md:block' : ''
      }`}
    >
      <div className="p-4 flex-1 min-h-0">
        {selectedWorkflowName && (
          <div className="flex justify-between items-start mb-6">
            <input
              type="text"
              value={editedWorkflowName || ''}
              onChange={(e) => setEditedWorkflowName(e.target.value)}
              className="text-2xl font-bold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none"
            />
            <div className="flex space-x-4">
              <button 
                onClick={handleWorkflowNameSave} 
                className="text-blue-500 hover:text-blue-600"
              >
                <HiOutlineCheck className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

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
            {agentList.map((agent: Agent, index: number) => (
              <li key={agent._id} className="relative group">
                {index !== 0 && (
                  <div className="absolute left-1/2 -top-[24px] h-[20px] w-0.5 bg-gradient-to-b from-blue-200 to-blue-400 dark:from-blue-800 dark:to-blue-600 transform -translate-x-1/2 z-0" />
                )}
                
                {index !== agentList.length - 1 && (
                  <div className="absolute left-1/2 -bottom-[24px] h-[20px] w-0.5 bg-gradient-to-b from-blue-400 to-blue-200 dark:from-blue-600 dark:to-blue-800 transform -translate-x-1/2 z-0" />
                )}
                
                <div className="relative">
                  <div
                    onClick={() => onSelectAgent(agent._id)}
                    className={`
                      w-full text-left p-4 rounded-lg
                      relative z-10
                      transition-all duration-200 ease-in-out
                      bg-white dark:bg-black
                      border-2 border-blue-400/30 dark:border-blue-600/30
                      shadow-[0_0_15px_rgba(59,130,246,0.2)] dark:shadow-[0_0_15px_rgba(37,99,235,0.2)]
                      hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]
                      hover:border-blue-400/50 dark:hover:border-blue-600/50
                      cursor-pointer
                      ${
                        selectedAgentId === agent._id
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
                        <div className="flex items-center space-x-2">
                          <span className="text-[14px] text-gray-500 dark:text-gray-400">
                            {agent.model}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setAgentToDelete(agent._id);
                            }}
                            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 dark:text-gray-400 ml-2"
                          >
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
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
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ConfirmDialog
        isOpen={agentToDelete !== null}
        title="Delete Agent"
        message="Are you sure you want to delete this agent? This action cannot be undone."
        onConfirm={handleDeleteAgent}
        onCancel={() => setAgentToDelete(null)}
      />
    </div>
  );
};

export default AgentList; 
