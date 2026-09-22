import moment from 'moment';

const TaskListTable = ({ tableData }) => {
  // status badge palette
  const getStatusBadgeColor = (status) => {
    const statusStyles = {
      Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
      'In Progress': 'bg-blue-50 text-blue-700 border border-blue-200',
      Completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    };

    return (
      statusStyles[status] ||
      'bg-slate-50 text-slate-600 border border-slate-200'
    );
  };

  // priority badge palette
  const getPriorityBadgeColor = (priority) => {
    const priorityStyles = {
      High: 'bg-rose-50 text-rose-700 border border-rose-200',
      Medium: 'bg-orange-50 text-orange-700 border border-orange-200',
      Low: 'bg-sky-50 text-sky-700 border border-sky-200',
    };

    return (
      priorityStyles[priority] ||
      'bg-slate-50 text-slate-600 border border-slate-200'
    );
  };

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
      <table className="w-full whitespace-nowrap text-left text-sm text-gray-600">
        <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-100">
          <tr>
            <th className="py-3.5 px-4">Name</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4">Priority</th>
            <th className="py-3.5 px-4">Created On</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {tableData && tableData.length > 0 ? (
            tableData.map((task) => (
              <tr
                key={task._id}
                className="hover:bg-gray-50/60 transition-colors"
              >
                <td className="py-3 px-4 font-medium text-gray-800 max-w-[200px] truncate">
                  {task.title}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full inline-block ${getStatusBadgeColor(
                      task.status,
                    )}`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full inline-block ${getPriorityBadgeColor(
                      task.priority,
                    )}`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs text-gray-500">
                  {task.createdAt
                    ? moment(task.createdAt).format('Do MMM YYYY')
                    : 'N/A'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="py-6 text-center text-sm text-gray-400"
              >
                No tasks available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskListTable;
