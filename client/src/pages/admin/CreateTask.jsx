import { useState } from 'react';
import { LuTrash2 } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';
import SelectDropdown from '../../components/Inputs/SelectDropdown';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { PRIORITY_DATA } from '../../utils/data';

const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    dueDate: null,
    assignedTo: [],
    todoCheckList: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    // reset form
    setTaskData({
      title: '',
      description: '',
      priority: 'Low',
      dueDate: null,
      assignedTo: [],
      todoCheckList: [],
      attachments: [],
    });
  };

  // create task
  const createTask = async () => {};

  // update task
  const updateTask = async () => {};

  // submit
  const handleSubmit = async () => {};

  // get task info by ID
  const getTaskDetailsByID = async () => {};

  // delete task
  const deleteTask = async () => {};
  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {taskId ? 'Update Task' : 'Create Task'}
              </h2>

              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded-full px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Delete
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className="text-md font-medium text-slate-600">
                Task Title
              </label>

              <input
                type="text"
                className="form-input"
                placeholder="Create App UI"
                value={taskData.title}
                onChange={({ target }) =>
                  handleValueChange('title', target.value)
                }
              />
            </div>

            <div className="mt-3">
              <label className="text-md font-medium text-slate-600">
                Description
              </label>

              <textarea
                className="form-input"
                placeholder="Describe task"
                rows={4}
                value={taskData.description}
                onChange={({ target }) =>
                  handleValueChange('description', target.value)
                }
              ></textarea>
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-md font-medium text-slate-600">
                  Priority
                </label>

                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange('priority', value)}
                  placeholder="Select Priority"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateTask;
