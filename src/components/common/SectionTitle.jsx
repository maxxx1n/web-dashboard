export const SectionTitle = ({ title, sub }) => (
  <div style={{ marginBottom: 28 }}>
    <h1 className="page-title">{title}</h1>
    {sub && <p className="page-subtitle">{sub}</p>}
  </div>
);

export default SectionTitle;
