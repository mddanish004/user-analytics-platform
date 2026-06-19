function StatCard({ label, value }) {
  return (
    <div className="flex-1 bg-white border border-gray-200 rounded-lg p-5">
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
        {label}
      </p>
      <p className="text-4xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default StatCard;
