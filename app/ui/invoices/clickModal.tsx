'use client';

import { useState, useEffect, useRef } from 'react';


function HoverModal({ children, content }: { children: React.ReactNode, content: React.ReactNode }) 
{
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if(isOpen) 
    {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block">
      <div 
        onClick={() => setIsOpen(true)}
        className="cursor-pointer"
      >
        {children}
      </div>

      {isOpen && (
        <div 
          ref={modalRef}
          className="absolute z-50 mt-2 bg-white rounded-md shadow-lg border border-gray-200"
        >
          <div className="p-3">
            {content}
          </div>
        </div>
      )}
    </div>
  );
}

export default HoverModal;
