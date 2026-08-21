export function ConversationSkeleton() {
  return (
    <div className="space-y-2 p-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 animate-pulse"
        >
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex items-center justify-between">
              <div className="w-24 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="w-10 h-2 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
            <div className="w-36 h-2.5 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
