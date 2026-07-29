# Bridgeway Medical Logistics

## What it is

Marketing site for a medical courier serving New York City and northern New
Jersey. Founded by Joseph Henry. Dispatch: (516) 554-1252.

## Register

**Brand.** Design is the product here. The site's whole job is converting cold
credibility into a phone call or a quote request.

## Who it is for

Office managers, lab administrators and practice managers who are **vetting a
vendor**, not shopping. They are assembling a compliance file and they are
risk-averse by profession. Concretely:

- Clinical laboratories
- Hospitals and health systems
- Physician practices and clinics
- Pharmacies, including specialty and infusion

They are asking: is this outfit insured, are the drivers checked, is PHI handled
correctly, and will the specimen arrive inside its stability window. Flashy
design actively hurts here. Precision reassures.

## What it has to do

1. Get the dispatch number called. That is the primary conversion, and it beats
   the form for anything time-critical. The number is present in the header, the
   hero, the quote band and the footer.
2. Answer compliance questions before they are asked, so the site can be
   forwarded into a vendor packet.
3. Establish that the founder understands medical logistics specifically, not
   courier work generally.

## Constraints

- **No unverified claims.** Compliance assertions are tagged `data-verify` until
  Joseph confirms them. Fabricated certifications create real liability with
  this audience.
- **No fabricated social proof.** Testimonials and company milestones are
  omitted entirely until real ones exist.
- **Fast.** B2B logistics buyers value load speed and clarity over polish. No
  framework, no CDN, no external requests, 88KB of self-hosted fonts.
- **Hostinger shared hosting.** Apache and PHP, no Node, no build step. Joseph
  must be able to edit a file in hPanel and see the change.
- **One theme.** Light only. The identity is a document printed on white stock;
  there is no meaningful dark counterpart and a compliance reader is not looking
  for a theme toggle.

## Motion

One orchestrated moment on hero load, roughly 600ms, then the page is still.
Nothing animates on scroll anywhere. `prefers-reduced-motion` renders it static.

## Deliberately out of scope

Client portal, live tracking, online booking, pricing calculator. This is a
credibility surface that produces phone calls.
