import { Outlet, Link, useLocation } from "react-router";
import { Leaf, BookOpen, FlaskConical, Home, Menu, Package, Calculator } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useEffect } from "react";
import { captureUtmFromUrl, markSessionOnce, trackPageView } from "../utils/analytics";

export function Layout() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Capture UTM/referrer attribution and emit SPA page views.
  useEffect(() => {
    captureUtmFromUrl(location.search);
    markSessionOnce();
    trackPageView(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/recipes", label: "Recipes", icon: BookOpen },
    { path: "/infusions", label: "My Infusions", icon: FlaskConical },
    { path: "/ingredients", label: "Start Here", icon: Package },
    { path: "/learn", label: "Learn", icon: Leaf },
    { path: "/edibles-calculator", label: "Calculator", icon: Calculator },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const startHereState = { resetStartHere: true as const };

  const NavLinks = ({ mobile = false, compact = false }: { mobile?: boolean; compact?: boolean }) => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          state={item.path === "/ingredients" ? startHereState : undefined}
          className={`flex items-center rounded-lg transition-colors font-medium ${
            compact && !mobile
              ? "gap-1.5 px-2.5 py-1.5 text-sm"
              : "gap-2 px-4 py-3"
          } ${
            isActive(item.path)
              ? "bg-green-600 text-white shadow-sm"
              : mobile
              ? "text-gray-900 bg-gray-50 hover:bg-green-100 hover:text-green-800 border border-gray-200"
              : "text-gray-800 hover:bg-green-100 hover:text-green-700"
          } ${mobile ? "w-full text-base" : ""}`}
        >
          <item.icon
            className={`${mobile ? "w-5 h-5" : compact ? "w-4 h-4" : "w-5 h-5"} ${
              isActive(item.path) ? "text-white" : mobile ? "text-green-700" : "text-green-600"
            }`}
          />
          <span>{item.label}</span>
        </Link>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header — single compact row (~half the previous stacked layout) */}
      <header className="app-print-hide sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-green-200 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-2">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <Link to="/" className="flex items-center gap-2 min-w-0 shrink-0 max-w-[45%] sm:max-w-none">
              <div className="bg-gradient-to-br from-green-100 to-green-50 p-2 rounded-full shadow shrink-0">
                <Leaf className="w-5 h-5 text-green-700" />
              </div>
              <div className="min-w-0 leading-tight">
                <h1 className="text-lg sm:text-xl font-bold text-green-800 truncate">Infusion Sensei</h1>
                <p className="text-[10px] sm:text-xs text-green-700 font-semibold truncate hidden sm:block">
                  Cannabis Culinary Creations
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-1 min-w-0 flex-1 justify-end">
              <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 justify-end overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <NavLinks compact />
              </nav>

              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="text-green-700 h-9 w-9">
                    <Menu className="w-5 h-5" />
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
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 print:py-0 print:px-0 print:max-w-none">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="app-print-hide mt-20 border-t border-green-200 bg-green-50/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                <p className="text-sm text-gray-700">
                  Infusion Sensei © 2026 - Cannabis Culinary Education
                </p>
              </div>
              <Link
                to="/contact-us"
                className="text-sm font-semibold text-green-700 underline hover:text-green-800"
              >
                Contact Us
              </Link>
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