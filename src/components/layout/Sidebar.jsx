import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapse = () => setCollapsed(!collapsed);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Users", icon: Users, path: "/users" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 border-b bg-white shadow-sm">
        <h1 className="text-lg font-semibold">MyApp</h1>
        <Button variant="ghost" size="icon" onClick={toggleMobile}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen bg-white border-r shadow-sm flex flex-col transition-all duration-300 z-50",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b">
          {!collapsed && <h2 className="text-xl font-bold text-indigo-600">MyApp</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="hidden lg:flex"
          >
            <ChevronRight
              className={cn(
                "w-5 h-5 transition-transform",
                collapsed ? "-rotate-180" : "rotate-0"
              )}
            />
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100"
                )
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <Separator className="my-2" />

        {/* Footer */}
        <div className="px-2 py-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-2" />
            {!collapsed && "Logout"}
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={toggleMobile}
        />
      )}
    </>
  );
}
