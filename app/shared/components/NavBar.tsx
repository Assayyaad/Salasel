'use client'

import React, { useState } from 'react'
import SearchBar from './SearchBar'
import Drawer from './Drawer'

const NavBar: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const navs = [
    { name: 'الرئيسية', href: '/' },
    { name: 'مسار', href: '/masaar' },
    { name: 'عنّا', href: '/about' },
  ]

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setIsDrawerOpen(false)
  }

  return (
    <>
      <header className="sticky  top-0 z-10 bg-[#1C2739] backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-full px-4 sm:px-6 md:px-8 lg:px-28 mx-auto h-16 flex items-center justify-between">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navs.map((nav) => (
              <a
                key={nav.name}
                className="text-slate-400 hover:text-slate-200 transition-colors text-lg font-bold"
                href={nav.href}
              >
                {nav.name}
              </a>
            ))}
          </nav>
          <button
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 cursor-pointer"
            onClick={handleDrawerOpen}
          >
            <span className="material-icons-round">menu</span>
          </button>
          <SearchBar />
          <div className="flex items-center justify-end">
            <a className="text-lg font-bold tracking-tight text-slate-900 dark:text-white" href="#">
              سلاسل
            </a>
          </div>
        </div>
      </header>
      <Drawer isOpen={isDrawerOpen} onClose={handleDrawerClose}>
        <nav className="flex flex-col space-y-4">
          {navs.map((nav) => (
            <a
              key={nav.name}
              className="text-slate-400 hover:text-slate-200 transition-colors text-lg font-bold border-b border-slate-700 pb-2"
              href={nav.href}
            >
              {nav.name}
            </a>
          ))}
        </nav>
      </Drawer>
    </>
  )
}

export default NavBar
