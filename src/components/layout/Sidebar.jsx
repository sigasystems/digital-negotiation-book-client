import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import LogoutDialog from "../common/LogoutModal";
import {
  LayoutDashboard,
  Users,
  LogOut,
  ChevronRight,
  UserPlus,
  Fish,
  PlusCircle,
  X,
  MoveLeft,
  FileEdit,
  ClipboardList,
  ShoppingCart,
  CreditCard,
  Tag,
  ArrowUp,
  Globe,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useAuth from "@/app/hooks/useAuth";

export default function Sidebar({ collapsed, setCollapsed, onClose }) {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleCollapse = () => setCollapsed(!collapsed);

  const userRole = user?.userRole || "guest";
  const businessName = user?.businessName || "";

  const handleLogout = () => {
    logout();
    navigate("/login");
    if (onClose) onClose();
  };

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    ...(userRole === "super_admin"
      ? [{ name: "Business Owners", icon: Users, path: "/users" }]
      : userRole === "business_owner"
      ? [{ name: "Buyers", icon: Users, path: "/users" }]
      : []),
    ...(userRole === "business_owner"
      ? [
          { name: "Add Buyer", icon: UserPlus, path: "/add-buyer" },
          { name: "Products", icon: Fish, path: "/products" },
          { name: "Add Product", icon: PlusCircle, path: "/add-product" },
          { name: "Offer Drafts", icon: ClipboardList, path: "/offer-draft" },
          { name: "Create Offer Draft", icon: FileEdit, path: "/create-offer-draft" },
          { name: "Offers", icon: Tag, path: "/offers" },
          { name: "Location", icon: Globe, path: "/location" },
          { name: "Add Location", icon: MapPin, path: "/add-location" },
          { name: "Plan Purchase", icon: ShoppingCart, path: "/plan-purchase" },
          // { name: "Upgrade Plan", icon: ArrowUp, path: "/upgrade-plan" },
        ]
      : []),
    ...(userRole === "super_admin"
      ? [
          { name: "Add Business Owner", icon: UserPlus, path: "/add-business-owner" },
          { name: "Payment List", icon: CreditCard, path: "/payments-list" },
        ]
      : []),
    { name: "Back to Home", icon: MoveLeft, path: "/" },
  ];

  return (
    <>
      <TooltipProvider>
        <aside
          className={cn(
            "fixed top-0 left-0 h-screen bg-white border-r shadow-sm flex flex-col transition-width duration-300 z-40",
            collapsed ? "w-16" : "w-64"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 h-16 border-b select-none">
            {!collapsed && (
              <div className="flex flex-col max-w-[180px] truncate">
                <h2 className="text-2xl font-extrabold text-indigo-600 truncate">DNB</h2>
                {businessName && (
                  <span className="text-sm font-semibold text-gray-700 truncate">
                    {businessName}
                  </span>
                )}
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              className="hidden lg:flex cursor-pointer p-2 hover:bg-indigo-100 rounded focus-visible:ring focus-visible:ring-indigo-400"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              type="button"
            >
              <ChevronRight
                className={cn(
                  "w-5 h-5 text-indigo-600 transition-transform",
                  collapsed ? "rotate-0" : "rotate-180"
                )}
                strokeWidth={2.5}
              />
            </Button>

            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="lg:hidden cursor-pointer p-2 hover:bg-gray-200 rounded"
                aria-label="Close sidebar"
                type="button"
              >
                <X className="w-5 h-5 text-gray-700" strokeWidth={2} />
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav
            className={cn(
              "flex-1 overflow-y-auto py-3",
              "scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100 px-2",
              collapsed ? "flex flex-col items-center space-y-6" : "space-y-2"
            )}
          >
            {navItems.map(({ name, icon: Icon, path }) => {
              const link = (
                <NavLink
                  key={name}
                  to={path}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center rounded-md text-sm font-medium w-full transition-colors select-none cursor-pointer",
                      collapsed ? "justify-center p-2" : "gap-3 px-4 py-2",
                      isActive
                        ? "bg-indigo-100 text-indigo-700 font-semibold"
                        : "text-gray-700 hover:text-indigo-700 hover:bg-indigo-50",
                    )
                  }
                  title={collapsed ? name : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0 text-black-400" strokeWidth={2.2} />
                  {!collapsed && <span className="truncate">{name}</span>}
                </NavLink>
              );

              return collapsed ? (
                <Tooltip key={name} delayDuration={150}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-indigo-900 text-white text-sm px-3 py-1 rounded-md shadow-lg select-none"
                  >
                    {name}
                  </TooltipContent>
                </Tooltip>
              ) : (
                link
              );
            })}
          </nav>

          <Separator className="my-3" />

          {/* Footer / Logout */}
          <div className="px-2 pb-4 pt-2">
            {collapsed ? (
              <Tooltip delayDuration={150}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-center text-red-600 hover:bg-red-100 cursor-pointer px-2 py-2 rounded-md"
                    onClick={() => setLogoutOpen(true)}
                    aria-label="Logout"
                  >
                    <LogOut className="w-5 h-5" strokeWidth={2} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-red-900 text-white text-sm px-3 py-1 rounded-md shadow select-none"
                >
                  Logout
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:bg-red-100 cursor-pointer gap-2 rounded-md px-4 py-2"
                onClick={() => setLogoutOpen(true)}
                aria-label="Logout"
                type="button"
              >
                <LogOut className="w-5 h-5" strokeWidth={2} />
                <span className="select-none">Logout</span>
              </Button>
            )}
          </div>
        </aside>
      </TooltipProvider>

      {/* Logout Confirmation Modal */}
      <LogoutDialog
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onLogout={handleLogout}
      />
    </>
  );
}