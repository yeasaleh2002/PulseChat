"use client";

import { useState, useEffect } from "react";
import { Users, X, Search, Loader2, Check, UserPlus } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { searchUsers } from "@/services/chatService";
import { cn } from "@/lib/utils";

export interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const { createGroupAction } = useChatStore();

  const [groupName, setGroupName] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!userQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const users = await searchUsers(userQuery.trim());
        setSearchResults(users);
      } catch (err: unknown) {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [userQuery]);

  if (!isOpen) return null;

  const handleToggleUser = (user: User) => {
    const exists = selectedUsers.some((u) => u._id === user._id);
    if (exists) {
      setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveSelected = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== userId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!groupName.trim()) {
      setErrorMsg("Please enter a group name.");
      return;
    }

    if (selectedUsers.length === 0) {
      setErrorMsg("Please select at least 1 member for the group.");
      return;
    }

    setIsSubmitting(true);
    const participantIds = selectedUsers.map((u) => u._id);
    const result = await createGroupAction(groupName.trim(), participantIds);
    setIsSubmitting(false);

    if (result) {
      setGroupName("");
      setSelectedUsers([]);
      onClose();
    } else {
      setErrorMsg("Failed to create group. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden glass-panel">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/20">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Create New Group Chat
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-200 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Group Name *
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. Frontend Engineering Team"
              required
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
          </div>

          {selectedUsers.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Selected Participants ({selectedUsers.length})
              </label>
              <div className="flex flex-wrap gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 max-h-28 overflow-y-auto">
                {selectedUsers.map((u) => (
                  <span
                    key={u._id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-800 text-purple-900 dark:text-purple-200 text-xs font-medium"
                  >
                    <span>{u.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSelected(u._id)}
                      className="hover:text-rose-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Add Participants
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Search user name or phone..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
              {isSearching && (
                <Loader2 className="w-4 h-4 absolute right-3.5 top-3 text-purple-500 animate-spin" />
              )}
            </div>

            {userQuery.trim() !== "" && (
              <div className="mt-2 max-h-44 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-1.5 space-y-1">
                {searchResults.length === 0 && !isSearching ? (
                  <p className="p-3 text-center text-xs text-slate-400">
                    No users found matching &quot;{userQuery}&quot;
                  </p>
                ) : (
                  searchResults.map((user) => {
                    const isSelected = selectedUsers.some(
                      (u) => u._id === user._id,
                    );
                    return (
                      <button
                        type="button"
                        key={user._id}
                        onClick={() => handleToggleUser(user)}
                        className={cn(
                          "w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors",
                          isSelected
                            ? "bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-900 dark:text-slate-200",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center">
                            {user.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-[10px] text-slate-400">
                              {user.phone}
                            </p>
                          </div>
                        </div>
                        {isSelected ? (
                          <Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        ) : (
                          <UserPlus className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting || !groupName.trim() || selectedUsers.length === 0
              }
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/25"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating Group...
                </>
              ) : (
                "Create Group"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
