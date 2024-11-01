import React, { useState, useEffect } from "react";
import { Agent } from "@/data/types";
import { HiOutlineLink, HiOutlineShare, HiOutlineCheck } from "react-icons/hi2";

interface DetailViewProps {
  agent: Agent | null;
  onSave: (agent: Agent) => Promise<void>;
}

const DetailView: React.FC<DetailViewProps> = ({ agent, onSave }) => {
  const [editedAgent, setEditedAgent] = useState<Agent | null>(agent);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditedAgent(agent);
  }, [agent]);

  const handleSave = async () => {
    if (editedAgent) {
      setIsSaving(true);
      try {
        await onSave(editedAgent);
      } catch (error) {
        console.error('Failed to update agent:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (!agent || !editedAgent) {
    return (
      <div className="flex-1 p-4 bg-white dark:bg-black">
        <p>Select an agent to view details.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-black">
      <div className="p-4">
        <div className="flex justify-between items-start mb-6">
          <input
            type="text"
            value={editedAgent.name}
            onChange={(e) => setEditedAgent({ ...editedAgent, name: e.target.value })}
            className="text-2xl font-bold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none"
          />
          <div className="flex space-x-4">
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className={`text-blue-500 hover:text-blue-600 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <HiOutlineCheck className="w-6 h-6" />
            </button>
            <button className="text-gray-600 hover:text-blue-600">
              <HiOutlineLink className="w-6 h-6" />
            </button>
            <button className="text-gray-600 hover:text-blue-600">
              <HiOutlineShare className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Role</h3>
            <input
              type="text"
              value={editedAgent.role}
              onChange={(e) => setEditedAgent({ ...editedAgent, role: e.target.value })}
              className="w-full p-2 bg-gray-100 dark:bg-gray-900 rounded-md"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">System Prompt</h3>
            <textarea
              value={editedAgent.systemPrompt}
              onChange={(e) => setEditedAgent({ ...editedAgent, systemPrompt: e.target.value })}
              className="w-full h-32 p-2 bg-gray-100 dark:bg-gray-900 rounded-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Model</h3>
              <div className="relative">
                <select
                  value={editedAgent.model}
                  onChange={(e) => setEditedAgent({ ...editedAgent, model: e.target.value })}
                  className="w-full p-2 bg-gray-100 dark:bg-gray-900 rounded-md appearance-none
                    border border-gray-200 dark:border-gray-700
                    text-gray-900 dark:text-gray-100
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{
                    WebkitAppearance: 'none',
                    MozAppearance: 'none'
                  }}
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="claude-3-opus">Claude 3 Opus</option>
                  <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Temperature</h3>
              <input
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={editedAgent.temperature}
                onChange={(e) => setEditedAgent({ ...editedAgent, temperature: parseFloat(e.target.value) })}
                className="w-full p-2 bg-gray-100 dark:bg-gray-900 rounded-md
                  border border-gray-200 dark:border-gray-700
                  text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <textarea
              value={editedAgent.description}
              onChange={(e) => setEditedAgent({ ...editedAgent, description: e.target.value })}
              className="w-full h-24 p-2 bg-gray-100 dark:bg-gray-900 rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;
