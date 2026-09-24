const DeleteAlert = ({ content, onDelete }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-slate-600 leading-relaxed">
        {content}
      </p>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-xl transition-all duration-150 cursor-pointer shadow-xs"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;
