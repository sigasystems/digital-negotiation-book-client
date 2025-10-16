import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function Sidebar({ collapsed, setCollapsed }) {
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Users", icon: Users, path: "/users" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  const toggleCollapse = () => setCollapsed(!collapsed);

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex fixed top-0 left-0 h-screen bg-white border-r shadow-sm flex-col transition-all duration-300 z-40",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b">
          {!collapsed && (<h2 className="text-xl font-bold text-indigo-600">MyApp</h2>)}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="hidden lg:flex cursor-pointer"
          >
            <ChevronRight
              className={cn(
                "w-5 h-5 transition-transform",
                collapsed ? "rotate-180" : "rotate-0"
              )}
            />
          </Button>
        </div>

        {/* Nav links */}
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
    </>
  );
}
