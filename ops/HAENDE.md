# What only your hands can do

Order = priority. Ticked off here and in the order log.

## Immediately (blocks the work)

- [x] **GitHub:** create an empty, private repo `website-business` (https://github.com/new, without README) and give the
      Claude app access (https://github.com/apps/claude/installations/select_target). Then I push.

## Front 1 – Website creation

- [ ] **Higgsfield account** and subscription with credits; connect it in Claude: Settings → Connectors → Custom Connector →
      `https://mcp.higgsfield.ai/mcp`. Read the terms of use on commercial use.
- [ ] Create and verify a **Stripe account** (ID, bank account). **Test mode** only at first.
      For Claude: connect the Stripe connector in Claude (OAuth). From 31.10.2026 Stripe MCP accepts only OAuth or agent keys.
- [ ] **Cal.com account** (or self-hosted later) for appointment booking.
- [ ] **Resend account** (EU region) for the contact form, verify the sender domain.

## Front 2 – Hosting

- [ ] **Cloudflare account** with 2-factor, accept the data processing agreement (DPA), connect Pages to GitHub (`hosting/CLOUDFLARE.md`).
- [ ] Buy your own **domain** for your business (ideally directly at Cloudflare).

## Front 3 – Maintenance & subscription

- [ ] Set the **package prices** (`wartung/PAKETE.md`).
- [ ] Create the subscription products in Stripe (Basis/Plus/Premium) and activate the customer portal.
- [ ] Approve the weekly Claude routine as soon as the repo exists (I set it up, you confirm).

## Front 4 – Authorities, legal, bookkeeping (`recht/LEITFADEN.md`)

- [ ] Appointment with the **tax advisor** (trade/freelance, small-business rule, reverse charge).
- [ ] **Business registration** at the trade office, then the **tax registration questionnaire** in ELSTER.
- [ ] Open a **business account**, choose **bookkeeping software**.
- [ ] Take out **IT liability insurance**.
- [ ] Obtain **contract templates**: contract for work, maintenance contract, data processing agreement, general terms.

## Open from earlier orders

- [x] URFA SOFRASI: logo decided, the original skyline stays → order A-002
- [ ] Bruder C (Hairstyle by Ümit): answer "implement 3?" → order A-004

## Geschäfts-E-Mail (05.10., A-088)
Ich habe keinen Zugang zu einem Postfach-Anbieter und kann selbst kein Postfach anlegen. Zu tun für Elias:
1. Domain festlegen und registrieren (dann `hallo@<domain>`).
2. Postfach wählen: Weiterleitung per Cloudflare Email Routing (kostenlos, an die private Adresse) oder ein Postfach beim Anbieter (z. B. Proton, Zoho, IONOS).
3. Zugang zum Postfach hat nur Elias; für das Kontaktformular braucht es nur die Zieladresse und den Resend-Schlüssel als Cloudflare-Secret (nie im Repo).
