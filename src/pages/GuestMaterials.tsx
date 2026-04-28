import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mountain, QrCode, Download, FileText, ArrowLeft, Loader2 } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import { toast } from "@/hooks/use-toast";
import { generateWelcomeGuidePdf } from "@/lib/welcomeGuidePdf";

const DEFAULT_URL = "https://steinbockchalets.com/region-guide";

const GuestMaterials = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [targetUrl, setTargetUrl] = useState(DEFAULT_URL);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [welcomePdfLoading, setWelcomePdfLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Redirect non-admins
  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, adminLoading, navigate]);

  // Regenerate QR when URL changes
  useEffect(() => {
    if (!targetUrl) return;
    QRCode.toDataURL(targetUrl, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 600,
      color: { dark: "#1f1610", light: "#ffffff" },
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [targetUrl]);

  const downloadQrPng = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = "region-guide-qr.png";
    link.click();
  };

  const downloadA5Pdf = async () => {
    if (!qrDataUrl) return;
    setGeneratingPdf(true);
    try {
      // A5 portrait: 148 x 210 mm
      const doc = new jsPDF({ unit: "mm", format: "a5", orientation: "portrait" });
      const w = 148;

      // Background warm tone
      doc.setFillColor(252, 248, 242);
      doc.rect(0, 0, w, 210, "F");

      // Top accent bar
      doc.setFillColor(120, 80, 45);
      doc.rect(0, 0, w, 6, "F");

      // Brand name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(120, 80, 45);
      doc.text("STEINBOCK CHALETS", w / 2, 22, { align: "center" });

      // Heading DE
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(40, 30, 20);
      doc.text("Region-Guide", w / 2, 40, { align: "center" });

      // Subheading
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(90, 75, 60);
      doc.text("Hohe Tauern  ·  Pinzgau  ·  Pongau", w / 2, 48, { align: "center" });

      // Divider
      doc.setDrawColor(200, 180, 150);
      doc.setLineWidth(0.3);
      doc.line(40, 55, w - 40, 55);

      // QR Code
      const qrSize = 75;
      const qrX = (w - qrSize) / 2;
      doc.addImage(qrDataUrl, "PNG", qrX, 65, qrSize, qrSize);

      // Caption DE
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(40, 30, 20);
      doc.text("Scannen für Skigebiete,", w / 2, 152, { align: "center" });
      doc.text("Wanderungen & Ausflugstipps", w / 2, 158, { align: "center" });

      // Caption EN
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(120, 100, 80);
      doc.text("Scan for ski areas, hikes & day trips", w / 2, 168, { align: "center" });

      // URL footer
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(140, 120, 100);
      doc.text(targetUrl.replace(/^https?:\/\//, ""), w / 2, 198, { align: "center" });

      doc.save("region-guide-aufsteller-A5.pdf");
      toast({ title: "PDF erstellt", description: "Die Druckvorlage wurde heruntergeladen." });
    } finally {
      setGeneratingPdf(false);
    }
  };

  const generateWelcomeGuide = async (lang: "de" | "en") => {
    setWelcomePdfLoading(true);
    try {
      await generateWelcomeGuidePdf(lang);
      toast({
        title: "Welcome-Guide erstellt",
        description: "PDF wurde heruntergeladen.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Fehler",
        description: err instanceof Error ? err.message : "Konnte PDF nicht generieren",
        variant: "destructive",
      });
    } finally {
      setWelcomePdfLoading(false);
    }
  };

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-secondary/30 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Zurück zur Startseite
          </Button>
          <div className="flex items-center gap-2 text-primary">
            <Mountain className="h-5 w-5" />
            <span className="font-semibold">Gäste-Materialien</span>
          </div>
        </div>

        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
            Gäste-Materialien
          </h1>
          <p className="text-muted-foreground">
            Druckvorlagen und PDFs zum Teilen mit deinen Gästen — plattformkonform für Airbnb &
            Booking.com.
          </p>
        </div>

        {/* QR Code + Print PDF */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" /> QR-Code Aufsteller (A5)
            </CardTitle>
            <CardDescription>
              Druckbare A5-Vorlage mit QR-Code zur Region-Guide-Seite. Ideal für den Eingangsbereich
              im Chalet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="space-y-3">
                <Label htmlFor="targetUrl">Ziel-URL</Label>
                <Input
                  id="targetUrl"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Standardmäßig zeigt der QR-Code auf den öffentlichen Region-Guide.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button onClick={downloadQrPng} disabled={!qrDataUrl} variant="outline" className="gap-2">
                    <Download className="h-4 w-4" /> QR als PNG
                  </Button>
                  <Button onClick={downloadA5Pdf} disabled={!qrDataUrl || generatingPdf} className="gap-2">
                    {generatingPdf ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    A5-Druckvorlage (PDF)
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                {qrDataUrl ? (
                  <div className="bg-white p-5 rounded-xl shadow-sm border">
                    <img src={qrDataUrl} alt="QR-Code Vorschau" className="w-48 h-48" />
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-muted rounded-xl flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </CardContent>
        </Card>

        {/* Welcome Guide PDF */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Welcome-Guide PDF
            </CardTitle>
            <CardDescription>
              Vollständiger Region-Guide als PDF — perfekt zum Anhängen im Airbnb- oder
              Booking-Chat <strong>nach</strong> erfolgter Buchung.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={generateWelcomeGuide} disabled={welcomePdfLoading} className="gap-2">
              {welcomePdfLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              Welcome-Guide generieren
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              Generiert ein PDF aller 30 Region-Infos (Skigebiete, Wanderungen, Kultur, Radwege).
              Der Link öffnet sich in einem neuen Tab und kann von dort gespeichert werden.
            </p>
          </CardContent>
        </Card>

        {/* Compliance hint */}
        <Card className="border-accent/30 bg-accent/5">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-foreground mb-2">Plattform-Tipp</h3>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
              <li>Erwähne die Region-Guide-URL nicht in deiner Listing-Beschreibung auf Airbnb/Booking.</li>
              <li>Versende das PDF erst <strong>nach</strong> der Buchungsbestätigung im Chat.</li>
              <li>Der QR-Code im Chalet ist regelkonform und benötigt keine Plattform-Erlaubnis.</li>
              <li>Gäste finden den Region-Guide auch organisch über Google.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GuestMaterials;
