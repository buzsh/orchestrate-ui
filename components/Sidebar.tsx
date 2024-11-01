import React, { useState } from "react";
import { Workflow } from "@/data/types";
import { FaBrain } from "react-icons/fa";
import { HiCube, HiWrench, HiClock, HiPlus, HiEllipsisVertical } from "react-icons/hi2";
import { useDeleteWorkflow } from "@/hooks/useWorkflowMutations";
import ConfirmDialog from "./ConfirmDialog";

interface SidebarProps {
  workflows: Workflow[];
  selectedWorkflowId: string | null;
  onSelectWorkflow: (workflowId: string | null) => void;
  onCreateWorkflow: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  workflows = [],
  selectedWorkflowId,
  onSelectWorkflow,
  onCreateWorkflow,
}) => {
  const [workflowToDelete, setWorkflowToDelete] = useState<string | null>(null);
  const deleteWorkflow = useDeleteWorkflow();

  const handleDeleteWorkflow = async () => {
    if (workflowToDelete) {
      try {
        await deleteWorkflow.mutateAsync(workflowToDelete);
        setWorkflowToDelete(null);
        if (selectedWorkflowId === workflowToDelete) {
          onSelectWorkflow(null);
        }
      } catch (error) {
        console.error('Failed to delete workflow:', error);
      }
    }
  };

  const workflowList = Array.isArray(workflows) ? workflows : [];

  return (
    <>
      <aside className="w-full md:w-64 bg-white dark:bg-black md:bg-gray-100 md:dark:bg-gray-900 overflow-y-auto">
        <div className="overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl md:text-[21px] font-semibold text-gray-500 dark:text-gray-400 pl-2">
                Workflows
              </h2>
              <button
                onClick={onCreateWorkflow}
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400"
              >
                <HiPlus className="w-7 h-7 md:w-5 md:h-5" />
              </button>
            </div>
            <ul className="space-y-3 md:space-y-1">
              {workflowList.map((workflow: Workflow) => (
                <li key={workflow._id} className="group relative">
                  <div
                    onClick={() => onSelectWorkflow(workflow._id)}
                    className={`w-full flex items-center px-4 py-3 md:px-2 md:py-2 rounded-md cursor-pointer ${
                      selectedWorkflowId === workflow._id
                        ? "bg-blue-500 dark:bg-blue-600 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 md:hover:bg-gray-200 md:dark:hover:bg-[#2c2c2e]"
                    }`}
                  >
                    <HiCube className="w-6 h-6 md:w-5 md:h-5 mr-3" />
                    <span className="flex-1 text-left text-lg md:text-[15px] md:font-medium">{workflow.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setWorkflowToDelete(workflow._id);
                      }}
                      className={`opacity-0 group-hover:opacity-100 
                        ${selectedWorkflowId === workflow._id 
                          ? "text-white/70 hover:text-white" 
                          : "text-gray-500 hover:text-blue-500 dark:text-gray-400"
                        }`}
                    >
                      <HiEllipsisVertical className="w-6 h-6 md:w-6 md:h-6" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-4">
            <h2 className="text-2xl md:text-[21px] font-semibold text-gray-500 dark:text-gray-400 mb-4 pl-2">
              Tools
            </h2>
            <ul className="space-y-3 md:space-y-1">
              {[
                { icon: FaBrain, name: "Model Settings" },
                { icon: HiWrench, name: "API Config" },
                { icon: HiClock, name: "History" },
              ].map((item, index) => (
                <li key={index}>
                  <button className="w-full flex items-center px-4 py-3 md:px-2 md:py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 md:hover:bg-gray-200 md:dark:hover:bg-[#2c2c2e]">
                    <item.icon className="w-6 h-6 md:w-5 md:h-5 mr-3" />
                    <span className="text-lg md:text-[15px] md:font-medium">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      <ConfirmDialog
        isOpen={workflowToDelete !== null}
        title="Delete Workflow"
        message="Are you sure you want to delete this workflow? This action cannot be undone."
        onConfirm={handleDeleteWorkflow}
        onCancel={() => setWorkflowToDelete(null)}
      />
    </>
  );
};

export default Sidebar;
