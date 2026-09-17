import { useState } from 'react';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

const TodoListInput = ({ todoList = [], setTodoList }) => {
  const [option, setOption] = useState('');

  // add new todo item
  const handleAddOption = () => {
    if (option.trim()) {
      setTodoList([...todoList, option.trim()]);
      setOption('');
    }
  };

  // handle enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddOption();
    }
  };

  // delete todo item
  const handleDeleteOption = (index) => {
    const updatedArr = todoList.filter((_, idx) => idx !== index);
    setTodoList(updatedArr);
  };

  return (
    <div className="space-y-3">
      {/* existing todo items list */}
      {todoList.length > 0 && (
        <div className="space-y-2">
          {todoList.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl group transition-all duration-150"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-semibold text-slate-400 font-mono shrink-0">
                  {index < 9 ? `0${index + 1}` : index + 1}
                </span>
                <p className="text-xs sm:text-sm font-medium text-slate-700 truncate">
                  {item}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteOption(index)}
                className="text-slate-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded-lg transition-colors duration-150 cursor-pointer shrink-0"
                title="Delete task"
              >
                <LuTrash2 className="text-sm" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* input field to add new todo */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Add a checklist item..."
          value={option}
          onChange={({ target }) => setOption(target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 text-xs sm:text-sm font-medium text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 focus:ring-4 focus:ring-slate-900/5 transition-all duration-200 outline-none"
        />

        <button
          type="button"
          onClick={handleAddOption}
          className="inline-flex items-center gap-1 px-3.5 py-2.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 active:scale-95 rounded-xl border border-blue-200/60 transition-all duration-150 cursor-pointer shrink-0 shadow-2xs"
        >
          <LuPlus className="text-sm stroke-[2.5]" />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
};

export default TodoListInput;
