import { useState, useEffect } from "react";
import { Menu, X, LogOut, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";

const Navigation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, signOut } = useAuth();
  const [scrollPosition, setScrollPosition] = useState(false);

  // Auf der Startseite liegt oben ein dunkles Hero-Bild, dort ist die
  // Navigation zunaechst transparent mit weisser Schrift. Unterseiten haben
  // einen hellen Hintergrund - dort muss sie von Anfang an deckend sein,
  // sonst ist das Menue unlesbar.
  const istStartseite = location.pathname === "/";
  const isScrolled = scrollPosition || !istStartseite;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  // Links mit `id` scrollen zu einem Abschnitt der Startseite, Links mit `path`
  // fuehren auf eine eigene Seite.
  const navLinks: { label: string; id?: string; path?: string }[] = [
    { label: t("navigation.home"), id: "hero" },
    { label: t("navigation.about"), id: "about" },
    { label: t("navigation.features"), id: "features" },
    { label: t("navigation.gallery"), id: "galerie" },
    { label: t("navigation.directions"), path: "/anfahrt" },
    { label: t("navigation.booking"), id: "booking" },
    { label: t("navigation.contact"), id: "footer" },
  ];

  // Abschnitts-Links funktionieren nur auf der Startseite. Von einer Unterseite
  // aus wird zuerst dorthin gewechselt.
  const handleNavClick = (link: { id?: string; path?: string }) => {
    setIsMobileMenuOpen(false);
    if (link.path) {
      navigate(link.path);
      window.scrollTo({ top: 0 });
      return;
    }
    if (!link.id) return;
    if (window.location.pathname !== "/") {
      navigate("/#" + link.id);
      return;
    }
    scrollToSection(link.id);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button
              onClick={() => scrollToSection("hero")}
              className={`text-xl md:text-2xl font-bold transition-colors ${
                isScrolled ? "text-foreground hover:text-primary" : "text-white hover:text-white/80"
              }`}
            >
              Steinbock Chalet
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.id ?? link.path}
                  onClick={() => handleNavClick(link)}
                  className={`text-sm font-medium transition-colors relative group ${
                    isScrolled ? "text-foreground hover:text-primary" : "text-white hover:text-white/80"
                  }`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                    isScrolled ? "bg-primary" : "bg-white"
                  }`} />
                </button>
              ))}
              <LanguageSwitcher isScrolled={isScrolled} />
              {isAuthenticated ? (
                <Button
                  onClick={signOut}
                  variant="outline"
                  size="sm"
                  className={isScrolled ? "" : "border-white/50 text-white hover:bg-white/10"}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t("auth.logout")}
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/admin")}
                  variant="ghost"
                  size="sm"
                  className={isScrolled ? "" : "text-white hover:bg-white/10"}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {t("auth.admin")}
                </Button>
              )}
              <Button
                onClick={() => scrollToSection("booking")}
                className="bg-primary hover:bg-primary/90"
              >
                {t("navigation.bookNow")}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4 md:hidden">
              <LanguageSwitcher isScrolled={isScrolled} />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`transition-colors ${isScrolled ? "text-foreground" : "text-white"}`}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/98 backdrop-blur-lg md:hidden">
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id ?? link.path}
                onClick={() => handleNavClick(link)}
                className="text-2xl font-medium text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </button>
            ))}
            <Button
              onClick={() => scrollToSection("booking")}
              size="lg"
              className="bg-primary hover:bg-primary/90 mt-4"
            >
              {t("navigation.bookNow")}
            </Button>
            {isAuthenticated ? (
              <Button
                onClick={signOut}
                variant="outline"
                size="lg"
                className="mt-2"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t("auth.logout")}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  navigate("/admin");
                  setIsMobileMenuOpen(false);
                }}
                variant="ghost"
                size="lg"
                className="mt-2"
              >
                <Lock className="w-4 h-4 mr-2" />
                {t("auth.admin")}
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
