import React from 'react'

const Notes: React.FC = () => {
  return (
    <>
      <button className="w-full flex items-center justify-center gap-2 py-2 mb-4 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-DEFAULT hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
        <span className="material-icons-round text-base">add</span>
        أضف ملاحظة في 04:23
      </button>
      <div className="mb-6">
        <textarea
          className="w-full h-32 p-3 text-sm bg-gray-50 dark:bg-gray-900 border border-border-light dark:border-border-dark rounded-DEFAULT focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none"
          placeholder="اكتب ملاحظتك هنا..."
        ></textarea>
        <div className="flex justify-end mt-2">
          <button className="bg-primary text-white text-xs font-medium px-4 py-1.5 rounded-DEFAULT hover:bg-blue-600 transition-colors">
            إضافة
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        <div className="group flex gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer border border-transparent hover:border-border-light dark:hover:border-border-dark">
          <span className="text-primary font-mono text-xs font-semibold mt-1">02:03</span>
          <div className="flex-1">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Key concept introduced: deep work vs shallow work.
            </p>
          </div>
          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="text-gray-400 hover:text-primary">
              <span className="material-icons-round text-sm">edit</span>
            </button>
            <button className="text-gray-400 hover:text-red-500">
              <span className="material-icons-round text-sm">delete</span>
            </button>
          </div>
        </div>
        <div className="group flex gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer border border-transparent hover:border-border-light dark:hover:border-border-dark">
          <span className="text-primary font-mono text-xs font-semibold mt-1">13:55</span>
          <div className="flex-1">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Remember to check the supplementary PDF for the graph.
            </p>
          </div>
          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="text-gray-400 hover:text-primary">
              <span className="material-icons-round text-sm">edit</span>
            </button>
            <button className="text-gray-400 hover:text-red-500">
              <span className="material-icons-round text-sm">delete</span>
            </button>
          </div>
        </div>
        <div className="group flex gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer border border-transparent hover:border-border-light dark:hover:border-border-dark">
          <span className="text-primary font-mono text-xs font-semibold mt-1">21:10</span>
          <div className="flex-1">
            <p className="text-sm text-gray-700 dark:text-gray-300">The 20/20/20 rule is explained here.</p>
          </div>
          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="text-gray-400 hover:text-primary">
              <span className="material-icons-round text-sm">edit</span>
            </button>
            <button className="text-gray-400 hover:text-red-500">
              <span className="material-icons-round text-sm">delete</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Notes
