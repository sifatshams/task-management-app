const TaskStatusTabs = ({ tabs = [], activeTab, setActiveTab }) => {
  // configured distinct theme colors for each task status
  const getStatusStyles = (label, isActive) => {
    switch (label) {
      case 'Pending':
        return {
          button: isActive
            ? 'bg-white text-amber-600 shadow-sm border border-amber-200/60'
            : 'text-slate-500 hover:text-amber-600 hover:bg-amber-50/60',
          badge: isActive
            ? 'bg-amber-500 text-white'
            : 'bg-amber-100/80 text-amber-700',
        };
      case 'In Progress':
        return {
          button: isActive
            ? 'bg-white text-indigo-600 shadow-sm border border-indigo-200/60'
            : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/60',
          badge: isActive
            ? 'bg-indigo-600 text-white'
            : 'bg-indigo-100/80 text-indigo-700',
        };
      case 'Completed':
        return {
          button: isActive
            ? 'bg-white text-emerald-600 shadow-sm border border-emerald-200/60'
            : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/60',
          badge: isActive
            ? 'bg-emerald-600 text-white'
            : 'bg-emerald-100/80 text-emerald-700',
        };
      case 'All':
      default:
        return {
          button: isActive
            ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60'
            : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50/60',
          badge: isActive
            ? 'bg-blue-600 text-white'
            : 'bg-slate-200/80 text-slate-600',
        };
    }
  };

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1.5 bg-slate-100/80 border border-slate-200/60 rounded-xl">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.label;
        const styles = getStatusStyles(tab.label, isActive);

        return (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActiveTab(tab.label)}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer ${styles.button}`}
          >
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-colors ${styles.badge}`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TaskStatusTabs;
