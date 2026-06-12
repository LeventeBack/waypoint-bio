interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
}

export function StatCard({ label, value, delta }: StatCardProps) {
  return (
    <div className="bg-surface border border-stroke rounded-2xl p-5">
      <div className="text-[11.5px] font-bold uppercase tracking-widest text-faint">{label}</div>
      <div className="text-[28px] font-extrabold tracking-tight mt-1.5 leading-none">{value}</div>
      {delta && <div className="text-[12.5px] font-semibold text-emerald-400 mt-2">{delta}</div>}
    </div>
  );
}
