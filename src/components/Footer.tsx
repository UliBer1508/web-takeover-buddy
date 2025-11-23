import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer id="footer" className="bg-primary text-primary-foreground py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Kontakt</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-1" />
                <p className="text-sm text-primary-foreground/90">
                  Bergstraße 123<br />
                  6780 Alpendorf<br />
                  Österreich
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a href="tel:+4312345678" className="text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                  +43 1 234 5678
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a href="mailto:info@steinbock-chalet.com" className="text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                  info@steinbock-chalet.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: "Home", id: "hero" },
                { label: "Über Uns", id: "about" },
                { label: "Ausstattung", id: "features" },
                { label: "Buchung", id: "booking" },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      const element = document.getElementById(link.id);
                      if (element) element.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media & Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4">Folgen Sie uns</h3>
            <div className="flex gap-4 mb-6">
              <a
                href="#"
                className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-primary-foreground/90">
              Bleiben Sie auf dem Laufenden über Angebote und Neuigkeiten aus dem Steinbock Chalet.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/80">
            <p>© 2024 Steinbock Chalet. Alle Rechte vorbehalten.</p>
            <div className="flex gap-6">
              <button className="hover:text-primary-foreground transition-colors">
                Impressum
              </button>
              <button className="hover:text-primary-foreground transition-colors">
                Datenschutz
              </button>
              <button className="hover:text-primary-foreground transition-colors">
                AGB
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
