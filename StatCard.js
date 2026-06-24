export default function StatCard({ icon, iconBg, value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: iconBg }}>{icon}</div>
      <div className="stat-info">
        <h3>{value}</h3>
        <p>{label}</p>
      </div>
    </div>
  );
}
