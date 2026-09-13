const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
      {/* Left Color Indicator Bar */}
      <div className={`w-1.5 h-10 ${color} rounded-full shrink-0`} />

      {/* Content Area */}
      <div className="flex flex-col min-w-0">
        <span className="text-lg md:text-xl font-bold text-gray-900 leading-none truncate">
          {value}
        </span>
        <span className="text-xs md:text-sm font-medium text-gray-500 mt-1 truncate">
          {label}
        </span>
      </div>
    </div>
  );
};

export default InfoCard;
