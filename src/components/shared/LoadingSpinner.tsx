export function LoadingSpinner({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <span
      className={`${className} border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin`}
    />
  );
}
