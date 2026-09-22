import { useEffect, useState } from 'react';
import { LuPlus, LuSave, LuTrash2 } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AddAttachmentsInput from '../../components/Inputs/AddAttachmentsInput';
import SelectDropdown from '../../components/Inputs/SelectDropdown';
import SelectUsers from '../../components/Inputs/SelectUsers';
import TodoListInput from '../../components/Inputs/TodoListInput';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { API_PATHS } from '../../utils/api_path';
import axiosInstance from '../../utils/axios_instance';
import { PRIORITY_DATA } from '../../utils/data';

const CreateTask = () => {
  const location = useLocation();
  const taskId = location.state?.taskId;
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

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    setTaskData({
      title: '',
      description: '',
      priority: 'Low',
      dueDate: '',
      assignedTo: [],
      todoCheckList: [],
      attachments: [],
    });
    setError('');
  };

  // get task info by ID for update mode
  const getTaskDetailsByID = async () => {
    if (!taskId) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId),
      );
      const task = response.data?.task;

      if (task) {
        setTaskData({
          title: task.title || '',
          description: task.description || '',
          priority: task.priority || 'Low',
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
          assignedTo: task.assignedTo || [],
          todoCheckList: task.todoCheckList?.map((item) => item.text) || [],
          attachments: task.attachments || [],
        });
      }
    } catch (err) {
      console.error('Error fetching task details:', err);
      toast.error('Failed to load task details');
    } finally {
      setLoading(false);
    }
  };

  // create task
  const createTask = async () => {
    setLoading(true);

    try {
      const todolist = taskData.todoCheckList?.map((item) => ({
        text: item,
        completed: false,
      }));

      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoCheckList: todolist,
      });

      toast.success('Task created successfully');
      clearData();
      navigate('/admin/tasks');
    } catch (err) {
      console.error('Error creating task:', err);
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  // update task
  const updateTask = async () => {
    setLoading(true);
    try {
      const todolist = taskData.todoCheckList?.map((item) =>
        typeof item === 'string' ? { text: item, completed: false } : item,
      );

      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoCheckList: todolist,
      });

      toast.success('Task updated successfully');
      navigate('/admin/tasks');
    } catch (err) {
      console.error('Error updating task:', err);
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  // delete task
  const deleteTask = async () => {
    if (!taskId) return;
    setLoading(true);
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      toast.success('Task deleted successfully');
      navigate('/admin/tasks');
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  // submit handler
  const handleSubmit = async () => {
    setError(null);

    if (!taskData.title.trim()) {
      setError('Title is required!');
      return;
    }
    if (!taskData.description.trim()) {
      setError('Description is required!');
      return;
    }
    if (!taskData.dueDate) {
      setError('Due Date is required!');
      return;
    }
    if (taskData.assignedTo?.length === 0) {
      setError('Task not assigned to any member!');
      return;
    }
    if (taskData.todoCheckList?.length === 0) {
      setError('Add at least one todo task!');
      return;
    }

    if (taskId) {
      updateTask();
    } else {
      createTask();
    }
  };

  // effect to toggle between Create and Update mode
  useEffect(() => {
    if (taskId) {
      getTaskDetailsByID();
    } else {
      clearData();
    }
  }, [taskId]);

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="max-w-4xl mx-auto py-6 px-3 sm:px-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
          {/* header section */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                {taskId ? 'Update Task' : 'Create Task'}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-400 mt-0.5">
                {taskId
                  ? 'Modify the existing task details below'
                  : 'Fill in the information to assign a new task'}
              </p>
            </div>

            {taskId && (
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100/80 active:scale-95 px-3.5 py-2 rounded-xl border border-rose-200/60 transition-all duration-150 cursor-pointer shadow-2xs"
                onClick={deleteTask}
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

            {/* TODO checklist */}
            <div className="flex flex-col pt-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                TODO Checklist
              </label>
              <TodoListInput
                todoList={taskData?.todoCheckList}
                setTodoList={(value) =>
                  handleValueChange('todoCheckList', value)
                }
              />
            </div>

            {/* add attachments */}
            <div className="flex flex-col pt-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Add Attachments
              </label>
              <AddAttachmentsInput
                attachments={taskData?.attachments}
                setAttachments={(value) =>
                  handleValueChange('attachments', value)
                }
              />
            </div>

            {/* error banner */}
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200/80 rounded-xl">
                <p className="text-xs sm:text-sm font-medium text-rose-600">
                  {error}
                </p>
              </div>
            )}

            {/* submit action button */}
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50/80 hover:bg-blue-100/80 hover:text-blue-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed rounded-xl border border-blue-100/80 shadow-2xs transition-all duration-200 cursor-pointer"
              >
                {taskId ? (
                  <>
                    <LuSave className="text-base" />
                    <span>UPDATE TASK</span>
                  </>
                ) : (
                  <>
                    <LuPlus className="text-base stroke-[2.5]" />
                    <span>CREATE TASK</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateTask;
