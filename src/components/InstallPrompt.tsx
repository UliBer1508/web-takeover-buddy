import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const STORAGE_KEY = "pwa-install-dismissed-at";
const DISMISS_DAYS = 14;

const isStandalone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true);

const isIos = () =>
  typeof navigator !== "undefined" &&
  /iphone|ipad|ipod/i.test(navigator.userAgent) &&
  !/crios|fxios|edgios/i.test(navigator.userAgent);

const wasRecentlyDismissed = () => {
  try {
    const ts = Number(localStorage.getItem(STORAGE_KEY) || 0);
    if (!ts) return false;
    return Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
};

const InstallPrompt = () => {
  const { t } = useTranslation();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIos, setShowIos] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (isStandalone() || wasRecentlyDismissed()) return;

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    if (isIos()) setShowIos(true);

    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setHidden(true);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted" || outcome === "dismissed") {
      setDeferred(null);
      dismiss();
    }
  };

  if (hidden) return null;
  if (!deferred && !showIos) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-2xl border bg-card/95 p-4 shadow-lg backdrop-blur-md md:left-auto md:right-4"
    >
      <button
        onClick={dismiss}
        className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground hover:bg-muted"
        aria-label={t("pwa.dismiss", { defaultValue: "Schließen" })}
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <div className="rounded-xl bg-primary/10 p-2 text-primary">
          <Download className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="font-semibold leading-tight">
            {t("pwa.title", { defaultValue: "App installieren" })}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {deferred
              ? t("pwa.bodyAndroid", {
                  defaultValue:
                    "Steinbock Chalet als App installieren – schneller Zugriff vom Homescreen.",
                })
              : t("pwa.bodyIos", {
                  defaultValue:
                    "Tippe auf Teilen und „Zum Home‑Bildschirm“, um die App zu installieren.",
                })}
          </p>

          {deferred ? (
            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={install} className="gap-2">
                <Download className="h-4 w-4" />
                {t("pwa.install", { defaultValue: "Installieren" })}
              </Button>
              <Button size="sm" variant="ghost" onClick={dismiss}>
                {t("pwa.later", { defaultValue: "Später" })}
              </Button>
            </div>
          ) : (
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Share className="h-4 w-4" />
              <span>Safari → Teilen → „Zum Home‑Bildschirm“</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
