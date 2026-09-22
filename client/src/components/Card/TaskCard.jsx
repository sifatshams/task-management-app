import { LuCalendar, LuPaperclip, LuSquareCheck } from 'react-icons/lu';

const TaskCard = ({
  title,
  description,
  priority = 'Low',
  status = 'Pending',
  progress = 0,
  createdAt,
  dueDate,
  assignedTo = [],
  attachmentsCount = 0,
  completedTodoCount = 0,
  todoCheckList = [],
  onClick,
}) => {
  // priority styling helper
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-50 text-rose-600 border-rose-200/80';
      case 'Medium':
        return 'bg-amber-50 text-amber-600 border-amber-200/80';
      case 'Low':
      default:
        return 'bg-blue-50 text-blue-600 border-blue-200/80';
    }
  };

  // status styling helper
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200/80';
      case 'In Progress':
        return 'bg-indigo-50 text-indigo-600 border-indigo-200/80';
      case 'Pending':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const totalTodos = todoCheckList.length;

  return (
    <div
      onClick={onClick}
      className="group bg-white border border-slate-200/80 hover:border-blue-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4"
    >
      <div>
        {/* priority & status badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border ${getPriorityStyle(
              priority,
            )}`}
          >
            {priority} Priority
          </span>

          <span
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border ${getStatusStyle(
              status,
            )}`}
          >
            {status}
          </span>
        </div>

        {/* task title & description */}
        <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-1">
          {title}
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-1.5 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="space-y-3.5 pt-2 border-t border-slate-100">
        {/* progress bar */}
        {totalTodos > 0 && (
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
              <span>Progress</span>
              <span className="text-slate-700">{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* footer details: date, todo & attachments */}
        <div className="flex items-center justify-between pt-1">
          {/* due date */}
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
            <LuCalendar className="text-sm shrink-0" />
            <span>
              {dueDate
                ? new Date(dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                : 'No Date'}
            </span>
          </div>

          {/* checklist & attachments indicator */}
          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
            {totalTodos > 0 && (
              <div className="flex items-center gap-1" title="Checklist items">
                <LuSquareCheck className="text-sm shrink-0" />
                <span>
                  {completedTodoCount}/{totalTodos}
                </span>
              </div>
            )}

            {attachmentsCount > 0 && (
              <div className="flex items-center gap-1" title="Attachments">
                <LuPaperclip className="text-sm shrink-0" />
                <span>{attachmentsCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* assigned user avatars */}
        {assignedTo.length > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100/80">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Assigned To
            </span>
            <div className="flex -space-x-2 overflow-hidden">
              {assignedTo.slice(0, 3).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="User Avatar"
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                />
              ))}
              {assignedTo.length > 3 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 ring-2 ring-white text-[10px] font-bold text-slate-600">
                  +{assignedTo.length - 3}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
