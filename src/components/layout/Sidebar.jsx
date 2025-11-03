import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  UserPlus,
  Package,
  PlusCircle,
  X,
  MoveLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function Sidebar({ collapsed, setCollapsed, onClose }) {
  const [userRole, setUserRole] = useState("guest");
  const navigate = useNavigate();

  const toggleCollapse = () => setCollapsed(!collapsed);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUserRole(parsed?.userRole || "guest");
      }
    } catch (err) {
      console.error("Failed to parse user from sessionStorage:", err);
      setUserRole("guest");
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    navigate("/login");
    if (onClose) onClose();
  };

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },

    // Show Users for both super_admin and business_owner
    ...(["super_admin", "business_owner"].includes(userRole)
      ? [{ name: "Users", icon: Users, path: "/users" }]
      : []),

    // Show Add Buyer only for business_owner
    ...(userRole === "business_owner"
      ? [
          { name: "Add Buyer", icon: UserPlus, path: "/add-buyer" },
          { name: "Products", icon: Package, path: "/products" },
          { name: "Add Product", icon: PlusCircle, path: "/add-product" },
          { name: "Plan Purchase", icon: UserPlus, path: "/plan-purchase" },
          { name: "create offer draft", icon: UserPlus, path: "/create-offer-draft" },
        ]
      : []),

    // Show Add Business Owner only for super_admin
    ...(userRole === "super_admin"
      ? [
          // {
          //   name: "Add Business Owner",
          //   icon: ,UserPlus
          //   path: "/add-business-owner",
          // },
          {
            name: "Payment List",
            icon: UserPlus,
            path: "/payments-list",
          },
        ]
      : []),

    { name: "Settings", icon: Settings, path: "/settings" },
    { name: "Back to Home", icon: MoveLeft, path: "/" },
  ];

  return (
    <aside
      className={cn(
        "flex fixed top-0 left-0 h-screen bg-white border-r shadow-sm flex-col transition-all duration-300 z-40",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b">
        {!collapsed && (
          <h2 className="text-xl font-bold text-indigo-600">DNB</h2>
        )}
        
        {/* Desktop collapse button */}
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

        {/* Mobile close button */}
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => onClose && onClose()}
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

      {/* Footer / Logout */}
      <div className="px-2 py-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          {!collapsed && "Logout"}
        </Button>
      </div>
    </aside>
  );
}