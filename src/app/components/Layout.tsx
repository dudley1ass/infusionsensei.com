import { Outlet, Link, useLocation } from "react-router";
import { Leaf, BookOpen, FlaskConical, Home, Menu, Package } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useEffect } from "react";

export function Layout() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/recipes", label: "Recipes", icon: BookOpen },
    { path: "/infusions", label: "My Infusions", icon: FlaskConical },
    { path: "/ingredients", label: "Create Recipe", icon: Package },
    { path: "/learn", label: "Learn", icon: Leaf },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors font-medium ${
            isActive(item.path)
              ? "bg-green-600 text-white shadow-md"
              : mobile
              ? "text-gray-900 bg-gray-50 hover:bg-green-100 hover:text-green-800 border border-gray-200"
              : "text-gray-800 hover:bg-green-100 hover:text-green-700"
          } ${mobile ? "w-full text-base" : ""}`}
        >
          <item.icon className={`w-5 h-5 ${isActive(item.path) ? "text-white" : mobile ? "text-green-700" : "text-green-600"}`} />
          <span>{item.label}</span>
        </Link>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-green-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          {/* Logo - Centered */}
          <Link to="/" className="flex flex-col items-center gap-1 mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-100 to-green-50 p-4 rounded-full shadow-lg">
                <Leaf className="w-8 h-8 text-green-700" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-green-800">Infusion Sensei</h1>
            </div>
            <p className="text-sm md:text-base text-green-700 font-semibold">Cannabis Culinary Creations</p>
          </Link>

          {/* Navigation - Centered Below */}
          <div className="flex items-center justify-center">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <NavLinks />
            </nav>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-green-700">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white border-green-200">
                <nav className="flex flex-col gap-2 mt-8">
                  <NavLinks mobile />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-green-200 bg-green-50/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              <p className="text-sm text-gray-700">
                Infusion Sensei © 2026 - Cannabis Culinary Education
              </p>
            </div>
            <p className="text-xs text-gray-600 text-center md:text-right max-w-md">
              For educational purposes only. Know your local laws. Consume responsibly.
              Must be 21+ or comply with local regulations.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}