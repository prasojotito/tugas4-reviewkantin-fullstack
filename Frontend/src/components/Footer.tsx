export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>© {new Date().getFullYear()} Review Kantin Kampus</span>
        <span className="muted">Tugas 4 RSI · Frontend React &amp; Backend Express</span>
      </div>
    </footer>
  );
}