import React from 'react';

export const SectionTitle = ({ title, sub }) => (
  <div style={{ marginBottom: 28 }}>
    <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "#eaeaf5", letterSpacing: "-0.5px" }}>{title}</h1>
    {sub && <p style={{ color: "#7070a0", marginTop: 5, fontSize: 14 }}>{sub}</p>}
  </div>
);

export default SectionTitle;
