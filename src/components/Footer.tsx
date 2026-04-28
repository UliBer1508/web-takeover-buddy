import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer id="footer" className="bg-primary text-primary-foreground py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t("footer.contact")}</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-1" />
                <p className="text-sm text-primary-foreground/90">
                  Venedigersiedlung 315<br />
                  5741 Neukirchen am Großvenediger<br />
                  Österreich
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a href="tel:+4915757153466" className="text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors">+49 15757153466</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a href="mailto:info@steinbock-chalet.com" className="text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                  steinbockchalets@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://wa.me/4915757153466" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors"
                >
                  {t("footer.aboutUs")}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors"
                >
                  {t("footer.features")}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors"
                >
                  {t("footer.booking")}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('galerie')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors"
                >
                  {t("footer.gallery")}
                </button>
              </li>
              <li>
                <Link
                  to="/region-guide"
                  className="text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors"
                >
                  {t("language") === "Deutsch" || t("footer.copyright")?.includes("Steinbock") ? "Region-Guide" : "Region Guide"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media & Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t("footer.contactUs")}</h3>
            
            <p className="text-sm text-primary-foreground/90">
              {t("footer.stayUpdated")}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/80">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p>{t("footer.copyright")}</p>
              <span className="hidden md:inline text-primary-foreground/60">•</span>
              <span className="text-xs text-primary-foreground/60">v{__APP_VERSION__}</span>
            </div>
            <div className="flex gap-6">
              <button className="hover:text-primary-foreground transition-colors">
                {t("footer.imprint")}
              </button>
              <button className="hover:text-primary-foreground transition-colors">
                {t("footer.privacy")}
              </button>
              <button className="hover:text-primary-foreground transition-colors">
                {t("footer.terms")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
