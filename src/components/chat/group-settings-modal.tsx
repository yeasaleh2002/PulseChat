"use client";

import { useState, useEffect } from "react";
import {
  Users,
  X,
  Shield,
  UserMinus,
  ShieldCheck,
  Edit2,
  Check,
  UserPlus,
  Loader2,
  Search,
  LogOut,
} from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Conversation, User } from "@/types";
import { Button } from "@/components/ui/button";
import { searchUsers } from "@/services/chatService";
import { cn } from "@/lib/utils";

export interface GroupSettingsModalProps {
  conversation: Conversation;
  isOpen: boolean;
  onClose: () => void;
}

export function GroupSettingsModal({
  conversation,
  isOpen,
  onClose,
}: GroupSettingsModalProps) {
  const { user: currentUser } = useAuthStore();
  const {
    renameGroupAction,
    promoteToAdminAction,
    removeGroupMemberAction,
    addGroupMembersAction,
  } = useChatStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [newGroupName, setNewGroupName] = useState(conversation.name || "");
  const [isRenaming, setIsRenaming] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isAdmin = currentUser?._id
    ? conversation.admins?.includes(currentUser._id)
    : false;

  useEffect(() => {
    setNewGroupName(conversation.name || "");
  }, [conversation.name]);

  // Debounced search for adding new group members
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

  const handleRename = async () => {
    if (!newGroupName.trim() || newGroupName.trim() === conversation.name) {
      setIsEditingName(false);
      return;
    }

    setIsRenaming(true);
    await renameGroupAction(conversation._id, newGroupName.trim());
    setIsRenaming(false);
    setIsEditingName(false);
  };

  const handlePromoteAdmin = async (userId: string) => {
    setLoadingUserId(userId);
    await promoteToAdminAction(conversation._id, userId);
    setLoadingUserId(null);
  };

  const handleRemoveMember = async (userId: string) => {
    setLoadingUserId(userId);
    await removeGroupMemberAction(conversation._id, userId);
    setLoadingUserId(null);
  };

  const handleAddMember = async (user: User) => {
    setLoadingUserId(user._id);
    await addGroupMembersAction(conversation._id, [user._id]);
    setLoadingUserId(null);
    setUserQuery("");
    setSearchResults([]);
  };

  const handleLeaveGroup = async () => {
    if (!currentUser?._id) return;
    if (confirm("Are you sure you want to leave this group?")) {
      await removeGroupMemberAction(conversation._id, currentUser._id);
      onClose();
    }
  };

  const participants = Array.isArray(conversation.participants)
    ? (conversation.participants.filter((p) => typeof p !== "string") as User[])
    : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden glass-panel max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/20">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Group Settings
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                {participants.length} Participants • ID:{" "}
                {conversation._id.slice(0, 8)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Group Name & Rename */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Group Name
              </span>
              {isAdmin && !isEditingName && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-xs text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1 hover:underline"
                >
                  <Edit2 className="w-3 h-3" /> Rename
                </button>
              )}
            </div>

            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
                <button
                  onClick={handleRename}
                  disabled={isRenaming}
                  className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                >
                  {isRenaming ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                </button>
              </div>
            ) : (
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {conversation.name || "Group Chat"}
              </h4>
            )}
          </div>

          {/* Add Members Section (Admins Only) */}
          {isAdmin && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Add New Members
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="Search users to invite..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                {isSearching && (
                  <Loader2 className="w-3.5 h-3.5 absolute right-3 top-2.5 text-purple-500 animate-spin" />
                )}
              </div>

              {userQuery.trim() !== "" && (
                <div className="max-h-36 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-1 space-y-1">
                  {searchResults.map((user) => {
                    const isAlreadyMember = participants.some(
                      (p) => p._id === user._id,
                    );
                    return (
                      <div
                        key={user._id}
                        className="flex items-center justify-between p-2 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800/70"
                      >
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {user.name}
                        </span>
                        {isAlreadyMember ? (
                          <span className="text-[10px] text-slate-400">
                            Already member
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAddMember(user)}
                            disabled={loadingUserId === user._id}
                            className="px-2 py-1 rounded bg-purple-600 text-white font-medium text-[10px] flex items-center gap-1 hover:bg-purple-700"
                          >
                            {loadingUserId === user._id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <UserPlus className="w-3 h-3" /> Add
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Members List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Group Members ({participants.length})
              </span>
              {isAdmin && (
                <span className="text-[10px] text-purple-500 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Admin Controls Active
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              {participants.map((member) => {
                const isMemberAdmin = conversation.admins?.includes(member._id);
                const isSelf = member._id === currentUser?._id;

                return (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                        {member.name
                          ? member.name.slice(0, 2).toUpperCase()
                          : "U"}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-900 dark:text-white">
                            {member.name} {isSelf && "(You)"}
                          </span>
                          {isMemberAdmin && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[9px] font-bold font-mono">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {member.phone}
                        </span>
                      </div>
                    </div>

                    {/* Admin Actions */}
                    {isAdmin && !isSelf && (
                      <div className="flex items-center gap-1">
                        {!isMemberAdmin && (
                          <button
                            onClick={() => handlePromoteAdmin(member._id)}
                            disabled={loadingUserId === member._id}
                            title="Promote to Admin"
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors"
                          >
                            <Shield className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveMember(member._id)}
                          disabled={loadingUserId === member._id}
                          title="Remove from group"
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                        >
                          <UserMinus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between shrink-0">
          <Button
            onClick={handleLeaveGroup}
            variant="ghost"
            size="sm"
            className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 gap-1.5 text-xs font-semibold"
          >
            <LogOut className="w-4 h-4" /> Leave Group
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
