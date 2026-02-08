'use client'

import React, { useState } from 'react'
import { foundResults, searchTab, summaryTab, transcriptionTab } from '@/app/static'

const VideoDetailsTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('search')

  return (
    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
      <div className="flex border-b border-border-light dark:border-border-dark px-6 pt-2">
        <button
          className={`px-6 py-4 text-sm font-medium transition-colors ${
            activeTab === 'search'
              ? 'text-primary border-b-2 border-primary -mb-[1px] font-semibold'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('search')}
        >
          {searchTab}
        </button>
        <button
          className={`px-6 py-4 text-sm font-medium transition-colors ${
            activeTab === 'summary'
              ? 'text-primary border-b-2 border-primary -mb-[1px] font-semibold'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('summary')}
        >
          {summaryTab}
        </button>
        <button
          className={`px-6 py-4 text-sm font-medium transition-colors ${
            activeTab === 'transcription'
              ? 'text-primary border-b-2 border-primary -mb-[1px] font-semibold'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('transcription')}
        >
          {transcriptionTab}
        </button>
      </div>
      <div className="p-6 md:p-8">
        {activeTab === 'search' && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">غير متوفر حاليًا</div>
        )}
        {activeTab === 'summary' && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">غير متوفر حاليًا</div>
        )}
        {activeTab === 'transcription' && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">غير متوفر حاليًا</div>
        )}
      </div>
    </div>
  )
}

export default VideoDetailsTabs
