import { useState } from 'react';
import { LuTrash2 } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';
import SelectDropdown from '../../components/Inputs/SelectDropdown';
import SelectUsers from '../../components/Inputs/SelectUsers';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { PRIORITY_DATA } from '../../utils/data';
import TodoListInput from '../../components/Inputs/TodoListInput';

const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    dueDate: '',
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
      dueDate: '',
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
      <div className="max-w-5xl mx-auto py-6 px-2 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* header section */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-100">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tight">
                  {taskId ? 'Update Task' : 'Create Task'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  {taskId
                    ? 'Modify the existing task details below'
                    : 'Fill in the information to assign a new task'}
                </p>
              </div>

              {taskId && (
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50/80 hover:bg-rose-100/80 active:scale-95 px-3 py-1.5 rounded-lg border border-rose-200/60 transition-all duration-150 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-sm" />
                  <span>Delete</span>
                </button>
              )}
            </div>

            {/* form inputs section */}
            <div className="mt-6 space-y-5">
              {/* task title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Task Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full text-sm font-medium text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 focus:ring-4 focus:ring-slate-900/5 transition-all duration-200 outline-none"
                  placeholder="e.g., Design Landing Page UI"
                  value={taskData.title}
                  onChange={({ target }) =>
                    handleValueChange('title', target.value)
                  }
                />
              </div>

              {/* description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  className="w-full text-sm font-medium text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl p-4 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 focus:ring-4 focus:ring-slate-900/5 transition-all duration-200 outline-none resize-none"
                  placeholder="Provide detailed instructions or requirements for this task..."
                  rows={4}
                  value={taskData.description}
                  onChange={({ target }) =>
                    handleValueChange('description', target.value)
                  }
                ></textarea>
              </div>

              {/* priority & due date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Priority <span className="text-rose-500">*</span>
                  </label>
                  <SelectDropdown
                    options={PRIORITY_DATA}
                    value={taskData.priority}
                    onChange={(value) => handleValueChange('priority', value)}
                    placeholder="Select Priority"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Due Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full text-sm font-medium text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:border-slate-800 focus:ring-4 focus:ring-slate-900/5 transition-all duration-200 outline-none cursor-pointer [color-scheme:light]"
                    value={taskData.dueDate}
                    onChange={({ target }) =>
                      handleValueChange('dueDate', target.value)
                    }
                  />
                </div>
              </div>

              {/* assigned to */}
              <div className="flex flex-col pt-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Assigned To <span className="text-rose-500">*</span>
                </label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) => {
                    handleValueChange('assignedTo', value);
                  }}
                />
              </div>

              {/* todo check list */}
              <div className="flex flex-col pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  TODO Checklist <span className="text-rose-500">*</span>
                </label>
                <TodoListInput
                  todoList={taskData?.todoCheckList}
                  setTodoList={(value) =>
                    handleValueChange('todoCheckList', value)
                  }
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
