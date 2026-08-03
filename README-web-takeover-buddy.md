# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/922ecdf4-62f7-4188-90c5-8361d916fa8a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/922ecdf4-62f7-4188-90c5-8361d916fa8a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/922ecdf4-62f7-4188-90c5-8361d916fa8a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

## Buchungsanfragen und Zahlung (Stand 03.08.2026)

**Diese Website löst keine Zahlung aus.** `src/components/BookingForm.tsx`
enthält weder Stripe noch einen Aufruf einer Zahlungsfunktion.

Beim Absenden des Formulars passieren genau zwei Dinge:

1. Insert in `booking_inquiries` der **Website-Datenbank** (Lovable Cloud,
   Projekt `xcohqbdgzprkixeycdhk`).
2. Insert in `booking_inquiries` der **Hausverwaltungs-Datenbank**
   (`usblrulkcgucxtkhugck`) — nur wenn beim Haus `external_house_id` gesetzt
   ist. Fehlt sie, wird das protokolliert und der Gast erhält den Hinweis, sich
   bei ausbleibender Antwort zusätzlich per E-Mail zu melden.

Der angezeigte Preis stammt aus `calculatePriceBreakdown()` und den
**Website-eigenen** Hausdaten (`price_winter` / `price_summer` /
`price_offseason`). Die dynamische Preis-Engine der Hausverwaltung
(`pricing-engine`) ist daran nicht beteiligt — die Preise können daher
voneinander abweichen.

**Die Stripe-Zahlungsaufforderung entsteht erst in der Hausverwaltung**, nachdem
aus der Anfrage eine Buchung geworden ist: `booking_charges` →
Edge Function `create-payment-link` → E-Mail an den Gast. Details in
`hausmanagement-selfhosted/docs/CODE-INDEX.md`, Abschnitt 11b.

### Deploy-Hinweis

Dieses GitHub-Repo hat **keine aktive Lovable-Verbindung**. Deployt wird
ausschließlich über *Lovable Publish* (Hosting: Cloudflare). Änderungen, die nur
hier committet werden, gehen **nicht** live. Siehe
`hausmanagement-selfhosted/docs/ARBEITSWEISE-CLAUDE-LESSONS.md`, Abschnitt 6.3.
