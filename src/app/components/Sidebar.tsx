import { NavLink } from "react-router";
import bocraLogo from "../../bocra-logo.png";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Search,
  Shield
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Complaints", href: "/complaints", icon: MessageSquare },
  { name: "Licensing", href: "/licensing", icon: FileText },
  { name: "Tracking", href: "/tracking", icon: Search },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img
  src={bocraLogo}
  alt="BOCRA Logo"
  className="w-20 h-20 object-contain"
/>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">BOCRA</h1>
            <p className="text-xs text-gray-500">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="px-4 py-2 text-xs text-gray-500">
          <p>Botswana Communications</p>
          <p>Regulatory Authority</p>
          <p className="mt-2">v1.0.0</p>
        </div>
      </div>
    </aside>
  );
}
