import React from "react";
import { Workflow } from "@/data/types";
import { 
  FaBrain
} from "react-icons/fa";
import { HiCube, HiWrench, HiClock, HiPlus } from "react-icons/hi2";

interface SidebarProps {
  workflows: Workflow[];
  selectedWorkflowId: number | null;
  onSelectWorkflow: (workflowId: number | null) => void;
  onCreateWorkflow: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  workflows,
  selectedWorkflowId,
  onSelectWorkflow,
  onCreateWorkflow,
}) => {
  // Select first workflow by default if none is selected
  React.useEffect(() => {
    if (selectedWorkflowId === null && workflows.length > 0) {
      onSelectWorkflow(workflows[0].id);
    }
  }, [workflows, selectedWorkflowId, onSelectWorkflow]);

  return (
    <aside className="w-64 bg-gray-100 dark:bg-gray-900 overflow-y-auto">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[21px] font-semibold text-gray-500 dark:text-gray-400 pl-2">
            Workflows
          </h2>
          <button
            onClick={onCreateWorkflow}
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400"
          >
            <HiPlus className="w-5 h-5" />
          </button>
        </div>
        <ul className="space-y-1">
          {workflows.map((workflow) => (
            <li key={workflow.id}>
              <button
                onClick={() => onSelectWorkflow(workflow.id)}
                className={`w-full flex items-center px-2 py-1.5 rounded-md ${
                  selectedWorkflowId === workflow.id
                    ? "bg-blue-500 dark:bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2c2c2e]"
                }`}
              >
                <HiCube className="w-4 h-4 mr-3" />
                <span>{workflow.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-4">
        <h2 className="text-[21px] font-semibold text-gray-500 dark:text-gray-400 mb-4 pl-2">
          Tools
        </h2>
        <ul className="space-y-1">
          {[
            { icon: FaBrain, name: "Model Settings" },
            { icon: HiWrench, name: "API Config" },
            { icon: HiClock, name: "History" },
          ].map((item, index) => (
            <li key={index}>
              <button className="w-full flex items-center px-2 py-1.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2c2c2e]">
                <item.icon className="w-4 h-4 mr-3" />
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
