import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition ${
      location.pathname === path
        ? "bg-gray-100 text-gray-900"
        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
    }`;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Left: Logo + Links */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                T
              </div>
              
            </div>

            {/* Navigation */}
            <div className="flex gap-2">
              <Link to="/" className={linkClass("/")}>
                Personnel
              </Link>

              <Link to="/projects" className={linkClass("/projects")}>
                Projects
              </Link>

             

              <Link to="/skills" className={linkClass("/skills")}>
                Skills
              </Link>

              <Link to="/match" className={linkClass("/match")}>
                Match
              </Link>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
           

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              👤
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}
