import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface LanguageSwitcherProps {
  isScrolled?: boolean;
}

const LanguageSwitcher = ({ isScrolled = true }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const currentLang = i18n.language;
  
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => changeLanguage('de')}
        className={`px-2 py-1 h-auto text-sm font-medium transition-colors ${
          currentLang === 'de' 
            ? 'bg-primary/10 text-primary' 
            : isScrolled 
              ? 'text-muted-foreground hover:text-foreground' 
              : 'text-white/95 hover:text-white hover:bg-white/10'
        }`}
      >
        DE
      </Button>
      <span className={isScrolled ? 'text-muted-foreground' : 'text-white/80'}>|</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 h-auto text-sm font-medium transition-colors ${
          currentLang === 'en' 
            ? 'bg-primary/10 text-primary' 
            : isScrolled 
              ? 'text-muted-foreground hover:text-foreground' 
              : 'text-white/95 hover:text-white hover:bg-white/10'
        }`}
      >
        EN
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
