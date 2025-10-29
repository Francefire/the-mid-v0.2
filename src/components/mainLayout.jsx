import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Outlet, Link, useLocation } from "react-router-dom";
import { CheckSquare, Calculator, Home, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/authContext";
import { profile } from "@/lib/functions/profile";

const MainLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [userInfos, setUserInfos] = useState(null);
  useEffect(() => {
    profile.getProfile(user.$id).then((response) => {
      setUserInfos(response);
    });
  }, [user]);

  const AvatarComponent = () => {
    return userInfos ? (
      <Avatar>
        <AvatarImage src={userInfos?.profilePictureUrl} />
        <AvatarFallback>{userInfos?.firstName.charAt(0)}</AvatarFallback>
      </Avatar>
    ) : (
      <Avatar>
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
    );
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/rooms", label: "Rooms", icon: Users },
    {
      path: "/settings/general",
      label: userInfos?.firstName,
      icon: AvatarComponent,
    },
  ];

  return (
    <ScrollArea className="h-screen w-screen">
      <nav className=" fixed top-0 left-0 w-full border-b bg-background/20 backdrop-blur-md  z-10">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold">M</span>
            </div>
            <span className="text-xl font-bold tracking-tight">MyApp</span>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className="h-9"
                >
                  <Link to={item.path} className="flex items-center gap-2">
                    {item.label}
                    <Icon className="h-4 w-4" />
                  </Link>
                </Button>
              );
            })}
            <Button variant="ghost" size="sm" onClick={logout} className="h-9">
              Logout
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>
        </div>
      </nav>
      <div className="mt-16">
        <Outlet />
      </div>
    </ScrollArea>
  );
};

export default MainLayout;
