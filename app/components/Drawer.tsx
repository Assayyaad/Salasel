"use client";
import React from 'react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  direction?: 'rtl' | 'ltr';
}

const Drawer = ({ isOpen, onClose, children, direction = 'rtl' }: DrawerProps) => {
  const drawerClasses = `fixed top-0 ${direction === 'rtl' ? 'right-0' : 'left-0'} h-full bg-[#1C2739] w-64 z-[9999] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : direction === 'rtl' ? 'translate-x-full' : '-translate-x-full'}`;

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-[9998]" onClick={onClose}></div>}
      <div className={drawerClasses}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white">القائمة</h2>
            <button onClick={onClose} className="text-white cursor-pointer">
              <span className="material-icons-round">close</span>
            </button>
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

export default Drawer;
