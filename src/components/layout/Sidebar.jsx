import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import LogoutDialog from "../common/LogoutModal";
import {
  LayoutDashboard,
  Users,
  Settings,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getSession } from "@/utils/auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Sidebar({ collapsed, setCollapsed, onClose }) {
  const [sessionUser, setSessionUser] = useState(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const navigate = useNavigate();

  const toggleCollapse = () => setCollapsed(!collapsed);

  useEffect(() => {
    const user = getSession();
    setSessionUser(user);
  }, []);

  const userRole = sessionUser?.userRole || "guest";
  const businessName = sessionUser?.businessName || "";

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    navigate("/");
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
          { name: "Plan Purchase", icon: ShoppingCart, path: "/plan-purchase" },
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
            "flex fixed top-0 left-0 h-screen bg-white border-r shadow-sm flex-col transition-all duration-300 z-40",
            collapsed ? "w-16" : "w-64"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 h-16 border-b">
            {!collapsed && (
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-indigo-600">DNB</h2>
                {businessName && (
                  <span className="text-sm font-medium text-gray-700 truncate max-w-[180px]">
                    {businessName}
                  </span>
                )}
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              className="hidden lg:flex cursor-pointer"
            >
              <ChevronRight
                className={cn(
                  "w-5 h-5 transition-transform",
                  collapsed ? "rotate-0" : "rotate-180"
                )}
              />
            </Button>

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

          {/* Navigation */}
          <nav
            className={cn(
              "flex-1 overflow-y-auto py-4 space-y-1 transition-all",
              collapsed ? "flex flex-col items-center px-0" : "px-2"
            )}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const link = (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center rounded-md text-sm font-normal transition-all",
                      collapsed
                        ? "justify-center w-10 h-10"
                        : "gap-3 px-5 py-2 w-full justify-start"
                    )
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </NavLink>
              );

              return collapsed ? (
                <Tooltip key={item.name} delayDuration={150}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-gray-900 text-white text-sm px-2 py-1 rounded-md"
                  >
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              ) : (
                link
              );
            })}
          </nav>

          <Separator className="my-2" />

          {/* Footer / Logout */}
          <div className="px-2 py-4">
            {collapsed ? (
              <Tooltip delayDuration={150}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-center text-red-600 cursor-pointer"
                    onClick={() => setLogoutOpen(true)}
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-gray-900 text-white text-sm px-2 py-1 rounded-md"
                >
                  Logout
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 cursor-pointer"
                onClick={() => setLogoutOpen(true)}
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
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
