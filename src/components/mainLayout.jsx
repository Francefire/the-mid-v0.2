import { Button } from "@/components/ui/button";
import {
  NavigationMenu
} from "@/components/ui/navigation-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/authContext";
import { BookText, Gamepad2, Home, LogOut } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

export default function MainLayout() {
	const { user, logout } = useAuth();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* === SIDEBAR === */}
        <Sidebar className="bg-sidebar text-sidebar-foreground w-64">
          {/* Header */}
          <SidebarHeader className="p-5 text-4xl text-brand font-semibold">
            The Mind
          </SidebarHeader>

					<SidebarContent className="flex-1 p-3">
						<SidebarGroup>
							<SidebarGroupLabel className="text-muted-foreground mb-2">
								Navigation
							</SidebarGroupLabel>

              <SidebarMenu>
                <SidebarMenuItem className="flex items-center gap-2 p-2 rounded-md hover:bg-brand">
                  <Home className="w-4 h-4" />
                  <Link to="/" className="w-full block">
                    Accueil
                  </Link>
                </SidebarMenuItem>

                <SidebarMenuItem className="flex items-center gap-2 p-2 rounded-md hover:bg-brand">
                  <BookText className="w-4 h-4" />
                  <Link to="/rules" className="w-full block">
                    Règles du jeu
                  </Link>
                </SidebarMenuItem>

                <SidebarMenuItem className="flex items-center gap-2 p-2 rounded-md hover:bg-brand">
                  <Gamepad2 className="w-4 h-4" />
                  <Link to="/rooms" className="w-full block">
                    Mes parties
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          {/* Pied de la sidebar */}
          <SidebarFooter className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-brand"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex bg-gradient-to-br from-gradient-light via-background to-gradient-light h-screen w-full">
          {/* Navbar */}
          <nav className="text-foreground w-full p-5 shadow-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 hover:bg-brand" />
              </div>
              <NavigationMenu>
                <h1 className="text-xl font-bold text-foreground">
                  Bonjour, {user.name}
                </h1>
              </NavigationMenu>
            </div>
          </nav>
          {/* === Contenu dynamique === */}
          <div className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
