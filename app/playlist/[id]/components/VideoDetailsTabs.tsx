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
          <div className="mb-8">
            <div className="relative">
              <input
                className="w-full bg-gray-50 dark:bg-gray-900 border border-border-light dark:border-border-dark rounded-full py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-shadow shadow-sm"
                placeholder="ابحث في الفيديو..."
                type="text"
              />
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <span className="material-icons-round">search</span>
              </span>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{foundResults}</h3>
              <div className="space-y-3">
                <div className="flex items-center group bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark hover:border-primary dark:hover:border-primary rounded-lg p-4 cursor-pointer transition-all shadow-sm hover:shadow-md">
                  <div className="mr-4 flex-shrink-0">
                    <div className="bg-primary/10 text-primary w-12 h-12 rounded-full flex items-center justify-center">
                      <span className="material-icons-round">play_circle_outline</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                        Discussion on Cognitive Load
                      </h4>
                      <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                        05:42
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                      ...and that creates a high{' '}
                      <span className="font-bold text-gray-900 dark:text-gray-100 bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">
                        cognitive load
                      </span>{' '}
                      which prevents effective...
                    </p>
                  </div>
                  <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-icons-round text-gray-400">chevron_right</span>
                  </div>
                </div>
                <div className="flex items-center group bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark hover:border-primary dark:hover:border-primary rounded-lg p-4 cursor-pointer transition-all shadow-sm hover:shadow-md">
                  <div className="mr-4 flex-shrink-0">
                    <div className="bg-primary/10 text-primary w-12 h-12 rounded-full flex items-center justify-center">
                      <span className="material-icons-round">play_circle_outline</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                        Tools for Focus
                      </h4>
                      <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                        18:20
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                      ...using specific tools to reduce{' '}
                      <span className="font-bold text-gray-900 dark:text-gray-100 bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">
                        cognitive load
                      </span>{' '}
                      in your daily workflow...
                    </p>
                  </div>
                  <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-icons-round text-gray-400">chevron_right</span>
                  </div>
                </div>
                <div className="flex items-center group bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark hover:border-primary dark:hover:border-primary rounded-lg p-4 cursor-pointer transition-all shadow-sm hover:shadow-md">
                  <div className="mr-4 flex-shrink-0">
                    <div className="bg-primary/10 text-primary w-12 h-12 rounded-full flex items-center justify-center">
                      <span className="material-icons-round">play_circle_outline</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                        Q&amp;A Session
                      </h4>
                      <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                        32:15
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                      ...question from Sarah about managing{' '}
                      <span className="font-bold text-gray-900 dark:text-gray-100 bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">
                        cognitive load
                      </span>{' '}
                      during meetings...
                    </p>
                  </div>
                  <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-icons-round text-gray-400">chevron_right</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'summary' && <div>{summaryTab}</div>}
        {activeTab === 'transcription' && <div>{transcriptionTab}</div>}
      </div>
    </div>
  )
}

export default VideoDetailsTabs
