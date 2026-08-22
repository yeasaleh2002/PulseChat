"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Loader2, UserPlus, X, User as UserIcon } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { User } from "@/types";

export function UserSearch() {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchUsersAction,
    startDirectChatAction,
    clearSearchResults,
  } = useChatStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsOpen(true);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      clearSearchResults();
      return;
    }

    const timer = setTimeout(() => {
      searchUsersAction(searchQuery.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchUsersAction, clearSearchResults]);

  const handleSelectUser = async (user: User) => {
    setIsOpen(false);
    await startDirectChatAction(user._id);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Search by name or phone number..."
          className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => clearSearchResults()}
            aria-label="Clear search input"
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isOpen && searchQuery.trim() !== "" && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 max-h-64 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-2 animate-fade-in backdrop-blur-xl">
          <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <span>Search Results</span>
            {isSearching && (
              <Loader2 className="w-3 h-3 animate-spin text-brand-500" />
            )}
          </div>

          {isSearching ? (
            <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-brand-500" />{" "}
              Searching network...
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              No users found matching &quot;{searchQuery}&quot;
            </div>
          ) : (
            <div className="space-y-1">
              {searchResults.map((user) => (
                <button
                  key={user._id}
                  onClick={() => handleSelectUser(user)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-brand-50 dark:hover:bg-slate-800/80 transition-colors text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {user.name ? (
                        user.name.slice(0, 2).toUpperCase()
                      ) : (
                        <UserIcon className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {user.phone}
                      </p>
                    </div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-brand-500 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <UserPlus className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
