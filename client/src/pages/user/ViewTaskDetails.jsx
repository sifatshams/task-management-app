import { useEffect, useState } from 'react';
import {
  LuArrowLeft,
  LuCalendar,
  LuClock,
  LuSquareCheck,
  LuUser,
} from 'react-icons/lu';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { API_PATHS } from '../../utils/api_path';
import axiosInstance from '../../utils/axios_instance';

const ViewTaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // fetch task details by id
  const getTaskDetails = async () => {
    try {
      setLoading(true);
      const endpoint = API_PATHS.TASKS.GET_TASK_BY_ID(id);

      const response = await axiosInstance.get(endpoint);
      setTask(response.data?.task || response.data);
    } catch (error) {
      console.error('error fetching task details:', error);
    } finally {
      setLoading(false);
    }
  };

  // toggle todo checklist item status
  const handleToggleTodo = async (index) => {
    if (!task) return;

    const updatedChecklist = [...task.todoCheckList];
    updatedChecklist[index].completed = !updatedChecklist[index].completed;

    const updatedTask = { ...task, todoCheckList: updatedChecklist };
    setTask(updatedTask);

    try {
      setUpdating(true);
      const endpoint = API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(id);
      await axiosInstance.put(endpoint, { todoCheckList: updatedChecklist });
    } catch (error) {
      console.error('error updating todo checklist:', error);
      getTaskDetails(); // rollback state on failure
    } finally {
      setUpdating(false);
    }
  };

  // update task status
  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      const endpoint = API_PATHS.TASKS.UPDATE_TASK_STATUS(id);
      await axiosInstance.put(endpoint, { status: newStatus });
      setTask((prev) => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error('error updating task status:', error);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (id) getTaskDetails();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout activeMenu="My Tasks">
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-slate-500 font-medium animate-pulse">
            loading task details...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (!task) {
    return (
      <DashboardLayout activeMenu="My Tasks">
        <div className="max-w-4xl mx-auto my-10 p-6 bg-white border border-slate-200 rounded-2xl text-center">
          <p className="text-slate-600 font-semibold">task not found!</p>
          <button
            onClick={() => navigate('/user/tasks')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            back to my tasks
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="max-w-5xl mx-auto my-6 px-4 sm:px-6 space-y-6">
        {/* navigation back button and status drop-down menu */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/user/tasks')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <LuArrowLeft className="text-lg" /> back to my tasks
          </button>

          {/* status selection field */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              status:
            </span>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              className="bg-white border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* task details title box */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              {task.title}
            </h1>
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full ${
                task.priority === 'High'
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : task.priority === 'Medium'
                    ? 'bg-amber-50 text-amber-600 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              }`}
            >
              {task.priority} Priority
            </span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {task.description || 'no description provided for this task.'}
          </p>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <LuCalendar className="text-slate-400 text-sm" />
              <span>
                created: {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>
            {task.dueDate && (
              <div className="flex items-center gap-1.5">
                <LuClock className="text-slate-400 text-sm" />
                <span>
                  due date: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* checklist and assigned members grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* todo checklist section */}
          <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <LuSquareCheck className="text-indigo-600" />
                task checklist
              </h3>
              <span className="text-xs font-semibold text-slate-400">
                {task.todoCheckList?.filter((i) => i.completed).length || 0} /{' '}
                {task.todoCheckList?.length || 0} completed
              </span>
            </div>

            {task.todoCheckList?.length > 0 ? (
              <div className="space-y-2.5">
                {task.todoCheckList.map((item, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50/80 transition-all cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggleTodo(index)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span
                      className={`text-sm font-medium ${
                        item.completed
                          ? 'line-through text-slate-400'
                          : 'text-slate-700'
                      }`}
                    >
                      {item.text || item.title || item.task}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                no checklist items added for this task.
              </p>
            )}
          </div>

          {/* assigned team members list */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <LuUser className="text-indigo-600" />
              assigned members
            </h3>

            {task.assignedTo?.length > 0 ? (
              <div className="space-y-3">
                {task.assignedTo.map((member) => (
                  <div key={member._id} className="flex items-center gap-3">
                    {member.profileImage ? (
                      <img
                        src={member.profileImage}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center border border-indigo-100">
                        {member.name?.slice(0, 2).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        {member.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {member.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                no members assigned.
              </p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;
