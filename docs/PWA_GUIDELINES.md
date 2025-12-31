# PWA-Richtlinien für Steinbock Chalet

Diese Dokumentation beschreibt die PWA-Anforderungen, die bei allen Erweiterungen und Änderungen zu berücksichtigen sind.

## Übersicht

Die Anwendung ist als Progressive Web App (PWA) optimiert und bietet:
- **Installierbarkeit**: App kann auf Home-Screen installiert werden
- **Offline-Fähigkeit**: Wichtige Inhalte sind ohne Netzwerk verfügbar
- **Native-ähnliches Erlebnis**: Standalone-Modus ohne Browser-UI
- **Schnelle Ladezeiten**: Durch intelligentes Caching

## Technische Konfiguration

### vite-plugin-pwa
- **registerType**: `autoUpdate` - Service Worker aktualisiert sich automatisch
- **Manifest**: Inline in vite.config.ts definiert

### Web App Manifest
```json
{
  "name": "Steinbock Chalet - Ferienwohnung",
  "short_name": "Steinbock Chalet",
  "theme_color": "#8B4513",
  "background_color": "#F5F5DC",
  "display": "standalone",
  "orientation": "portrait-primary"
}
```

### Icons
| Datei | Größe | Verwendung |
|-------|-------|------------|
| pwa-192x192.png | 192×192 | Standard App-Icon |
| pwa-512x512.png | 512×512 | Splash Screen, hochauflösend |
| pwa-maskable-512x512.png | 512×512 | Android Adaptive Icons |
| apple-touch-icon.png | 180×180 | iOS Home-Screen |
| favicon.ico | 32×32 | Browser-Tab |

## Caching-Strategien

### NetworkFirst (für dynamische Inhalte)
Verwendet für:
- Supabase API-Anfragen
- Buchungsdaten
- Verfügbarkeitsdaten

**Verhalten**: Versucht zuerst Netzwerk, bei Fehler wird Cache verwendet.

### CacheFirst (für statische Inhalte)
Verwendet für:
- Bilder (Galerie, Hero)
- Fonts
- CSS/JS Assets

**Verhalten**: Cache wird bevorzugt, schnellere Ladezeiten.

## Entwicklungsrichtlinien

### 1. Touch-Optimierung
Alle interaktiven Elemente müssen:
- Mindestens **44×44px** Klickfläche haben
- Ausreichend Abstand zueinander haben
- Keine Hover-only Interaktionen nutzen

```tsx
// ❌ Schlecht
<button className="p-1 text-sm">Klick</button>

// ✅ Gut
<button className="p-3 min-h-[44px] min-w-[44px]">Klick</button>
```

### 2. Viewport-Anpassungen
Safe-Area für notched Displays berücksichtigen:

```css
/* In index.css */
:root {
  --safe-area-inset-top: env(safe-area-inset-top);
  --safe-area-inset-bottom: env(safe-area-inset-bottom);
}

.fixed-bottom {
  padding-bottom: calc(1rem + var(--safe-area-inset-bottom));
}
```

### 3. Offline-Handling
Für Formulare (z.B. Buchungsanfragen):

```tsx
// Daten bei Offline im localStorage speichern
const submitBooking = async (data: BookingData) => {
  if (!navigator.onLine) {
    localStorage.setItem('pendingBooking', JSON.stringify(data));
    toast.info('Anfrage wird gesendet, sobald Sie wieder online sind.');
    return;
  }
  // Normale Submission
};

// Bei Online-Status pending Requests senden
window.addEventListener('online', () => {
  const pending = localStorage.getItem('pendingBooking');
  if (pending) {
    submitBooking(JSON.parse(pending));
    localStorage.removeItem('pendingBooking');
  }
});
```

### 4. Performance-Optimierungen

#### Lazy Loading für Bilder
```tsx
<img 
  src={imageUrl} 
  loading="lazy" 
  decoding="async"
  alt="Beschreibung" 
/>
```

#### Code-Splitting für Admin-Bereich
```tsx
// In App.tsx
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));

<Route 
  path="/admin/*" 
  element={
    <Suspense fallback={<LoadingSpinner />}>
      <AdminDashboard />
    </Suspense>
  } 
/>
```

### 5. Neue Assets hinzufügen
Beim Hinzufügen neuer statischer Assets:

1. **Bilder**: In `public/` oder `src/assets/` ablegen
2. **Fonts**: Selbst hosten für Offline-Verfügbarkeit
3. **globPatterns** in vite.config.ts erweitern falls nötig

### 6. Theme-Konsistenz
PWA-Farben müssen mit dem Design-System übereinstimmen:

```
theme_color: #8B4513  (entspricht --primary)
background_color: #F5F5DC (entspricht --background)
```

Bei Änderungen am Design-System auch PWA-Manifest aktualisieren!

## Testing

### Lokales Testen
```bash
npm run build
npm run preview
```

### PWA-Validierung
1. Chrome DevTools → Application → Manifest
2. Lighthouse Audit für PWA-Score
3. Auf echtem Gerät installieren und testen

### Checkliste vor Release
- [ ] Manifest valide (Chrome DevTools)
- [ ] Icons in allen Größen vorhanden
- [ ] Service Worker registriert
- [ ] Offline-Modus funktioniert
- [ ] Install-Prompt erscheint
- [ ] Auf iOS und Android getestet

## Bekannte Einschränkungen

### iOS Safari
- Push Notifications erfordern iOS 16.4+
- Background Sync nicht unterstützt
- Kein automatisches Update-Prompt

### Offline-Modus
- Buchungsanfragen benötigen Netzwerk für finale Übermittlung
- Verfügbarkeitskalender zeigt gecachte Daten (ggf. veraltet)

## Wartung

### Service Worker Update
Bei größeren Änderungen den SW-Cache invalidieren:

```ts
// In vite.config.ts
VitePWA({
  workbox: {
    // Cache-Version erhöhen bei Breaking Changes
    cacheId: 'steinbock-chalet-v2',
  }
})
```

### Icon-Updates
Bei neuen Icons alle Größen gleichzeitig aktualisieren:
1. Neues Master-Icon (512×512) erstellen
2. Alle Varianten generieren
3. In public/ ersetzen
4. Cache invalidieren
