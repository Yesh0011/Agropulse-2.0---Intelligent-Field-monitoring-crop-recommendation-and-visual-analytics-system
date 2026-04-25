function SectionHeader({ title, subtitle, compact = false }) {
  return (
    <div className={compact ? "section-header compact" : "section-header"}>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

export default SectionHeader;