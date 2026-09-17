import { useState } from 'react';
import { LuFileText, LuLink, LuPlus, LuTrash2 } from 'react-icons/lu';

const AddAttachmentsInput = ({ attachments = [], setAttachments }) => {
  const [option, setOption] = useState('');

  // add new attachment link
  const handleAddOption = () => {
    if (option.trim()) {
      setAttachments([...attachments, option.trim()]);
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

  // delete attachment link
  const handleDeleteOption = (index) => {
    const updatedArr = attachments.filter((_, idx) => idx !== index);
    setAttachments(updatedArr);
  };

  return (
    <div className="space-y-3">
      {/* existing attachments list */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl transition-all duration-150"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                  <LuFileText className="text-sm" />
                </div>
                <a
                  href={item}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-medium text-slate-700 hover:text-blue-600 truncate transition-colors duration-150"
                  title={item}
                >
                  {item}
                </a>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteOption(index)}
                className="text-slate-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded-lg transition-colors duration-150 cursor-pointer shrink-0"
                title="Remove attachment"
              >
                <LuTrash2 className="text-sm" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* input field & add button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <LuLink className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Paste attachment link (e.g. Figma, Drive, GitHub)..."
            value={option}
            onChange={({ target }) => setOption(target.value)}
            onKeyDown={handleKeyDown}
            className="w-full text-xs sm:text-sm font-medium text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 focus:ring-4 focus:ring-slate-900/5 transition-all duration-200 outline-none"
          />
        </div>

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

export default AddAttachmentsInput;
