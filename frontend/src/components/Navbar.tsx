import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: 10, background: "#222" }}>
      <Link to="/" style={{ color: "#fff", marginRight: 15 }}>Personnel</Link>
      <Link to="/skills" style={{ color: "#fff", marginRight: 15 }}>Skills</Link>
      <Link to="/projects" style={{ color: "#fff", marginRight: 15 }}>Projects</Link>
      <Link to="/match" style={{ color: "#fff" }}>Match</Link>
    </nav>
  );
}
