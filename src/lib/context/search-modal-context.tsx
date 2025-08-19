"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SearchModalContextType {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

const SearchModalContext = createContext<SearchModalContextType | undefined>(undefined);

export const SearchModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <SearchModalContext.Provider value={{ searchOpen, setSearchOpen }}>
      {children}
    </SearchModalContext.Provider>
  );
};

export const useSearchModal = () => {
  const context = useContext(SearchModalContext);
  if (context === undefined) {
    throw new Error('useSearchModal must be used within a SearchModalProvider');
  }
  return context;
};
