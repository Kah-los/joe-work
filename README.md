# Bridgeway Medical Logistics

Marketing site for a medical courier serving New York City and northern New
Jersey. Static HTML, CSS and a small amount of JavaScript, plus one PHP endpoint
for the quote form. No build step, no framework, no npm install. You edit a
file, you upload it, it is live.

**Stack decision:** Hostinger shared hosting runs Apache and PHP, not Node. So
this is hand-authored HTML and CSS with a PHP form handler. That is also the
fastest thing to serve, which is what the audience wants. There is nothing to
compile, so you can make small edits from the hPanel file manager without a
development environment.

---

## 1. Before you publish

**This is the section that matters. Do not skip it.**

The site contains compliance claims that have not been confirmed. Publishing an
unverified HIPAA or insurance claim to hospital procurement is not a small
mistake: it can end a vendor relationship and create real liability. Every
unconfirmed claim is tagged in the markup.

Find them all:

```bash
grep -rn 'data-verify' index.html about.html
```

There are 18. For each one:

- **True?** Delete the `data-verify="pending"` attribute. Nothing else changes.
- **Not true?** Delete the whole element (the `<li>`, `<div class="creds__item">`
  or `<p>`). The layout is built to close up cleanly with fewer items.

### The claims currently on the page

| Where | Claim | Confirm |
|---|---|---|
| Home, "What you are vetting" | HIPAA trained, annual re-training, certificates available | ☐ |
| Home, "What you are vetting" | Bonded and insured: commercial auto, general liability, cargo | ☐ |
| Home, "What you are vetting" | Background checks and MVR review before first specimen | ☐ |
| Home, "What you are vetting" | Cold-chain: validated containers, temperature logged | ☐ |
| Home, Services | The `COLD` cold-chain service line exists at all | ☐ |
| Home, Coverage | Coverage area: five boroughs, western Long Island, northern NJ | ☐ |
| Home, Coverage | Zone 1/2/3 borough and county lists are correct | ☐ |
| Home + About | "Dispatch line, seven days a week" | ☐ |
| About, founder | Two placeholder paragraphs, see section 6 | ☐ |
| About, Driver standards | All six items | ☐ |

### Also replace before launch

- `REPLACE-WITH-YOUR-DOMAIN.com` in `index.html`, `about.html`, `robots.txt`
  and `sitemap.xml`. It appears in the canonical tag, the Open Graph tags and
  the structured data.
- `josephhenry@gmail.com`, see section 7.

### Deliberately left out

- **Testimonials.** You did not confirm having any, and inventing them for a
  real business deceives the buyers you are asking to trust you. When you have
  two or three real ones, that section is worth adding.
- **Company history and milestones.** Same reason. An empty timeline is worse
  than no timeline.
- **Published response times.** The coverage table says "Quoted per site"
  rather than a number. See section 5 for how to add real windows. Publishing a
  window you cannot hold is worse than publishing none.

---

## 2. Deploying to Hostinger

1. In hPanel, point your domain at the hosting plan and let Hostinger issue the
   free SSL certificate. Wait until `https://` works before continuing.
2. Open **hPanel > Files > File Manager** and go to `public_html`.
3. Upload everything in this repository **except**:
   - `_src/` (the full-resolution source image, not needed on the server)
   - `_leads/` (created on the server automatically)
   - `README.md`, `PRODUCT.md`, `DESIGN.md`, `.gitignore`
   - `api/config.example.php`

   The fastest way is to zip the rest locally, upload the zip, then use the file
   manager's Extract. Make sure `.htaccess` is included: file managers often
   hide dotfiles, so enable "show hidden files" and confirm it is there.
4. Create the form config, see section 3.
5. Set PHP to 8.1 or newer under **hPanel > Advanced > PHP Configuration**.
6. Load the site over `https://` and submit the form once as a test.

### File layout on the server

```
public_html/
  index.html  about.html  thanks.html  404.html
  favicon.svg  robots.txt  sitemap.xml  .htaccess
  api/
    quote.php  smtp.php  config.php      <- you create config.php
  assets/
    css/site.css
    js/site.js
    fonts/*.woff2
    img/*
_bridgeway_leads/                        <- created automatically, above public_html
```

The lead folder sits **outside** `public_html` on purpose, so captured customer
data is not reachable over the web.

---

## 3. Setting up the form

```bash
cp api/config.example.php api/config.php
```

Then edit `api/config.php` and set `notify_to` to your real inbox. That alone
makes the form work.

### Strongly recommended: use SMTP

Leaving `smtp_host` empty makes the site fall back to PHP `mail()`. That
technically works on Hostinger, but a warning from testing this build: **`mail()`
returned success for a message that was never deliverable.** A "sent" result
from `mail()` means the local mail program accepted it, not that anyone received
it. New domains sending through shared-host mail land in spam routinely.

For a business where a missed message is a lost account, spend the ten minutes:

1. In hPanel, create a mailbox such as `dispatch@yourdomain.com`.
2. Open **hPanel > Emails > Email Accounts > Configuration Settings** and copy
   the SMTP values.
3. Fill in `api/config.php`:

```php
'smtp_host'   => 'smtp.hostinger.com',
'smtp_port'   => 465,
'smtp_secure' => 'ssl',
'smtp_user'   => 'dispatch@yourdomain.com',
'smtp_pass'   => 'that mailbox password',
'notify_from' => 'dispatch@yourdomain.com',
```

`notify_from` must be an address on your own domain. A gmail.com address there
will get the message filtered as spoofed.

**Never commit `api/config.php`.** It holds a password and is already in
`.gitignore`.

---

## 4. Where leads go

Every submission is written to a CSV **before** any email is attempted:

```
_bridgeway_leads/leads-2026-07.csv
```

That ordering is deliberate. If SMTP is misconfigured or the host blocks mail,
the lead still exists on the server and you can download the CSV and call the
person back. You will not silently lose business to a mail problem.

The visitor sees success when the lead is safely recorded, even if the email
failed, because a mail problem is yours to fix and telling them to resubmit
would just produce duplicates. If **both** the log and the email fail, the
visitor is told to phone instead.

Open the CSV in Excel, Numbers or Sheets. To diagnose mail problems, check the
PHP error log in hPanel; failures are written there with a reason.

### Spam controls, already in place

- An off-screen honeypot field that only a bot fills.
- A timing check that rejects a form submitted within 3 seconds of loading.
- A per-IP rate limit, 6 submissions per hour, tunable in `config.php`.
- Server-side validation of every field, regardless of what the browser did.

Bots get a normal-looking success response rather than an error, so they do not
learn to retry.

---

## 5. Common edits

**Phone number.** It appears in several places, including `tel:` links and the
structured data. Change all of them:

```bash
grep -rn '5165541252\|554-1252' *.html api/*.php assets/js/site.js
```

**Publishing real response windows.** In `index.html`, find the coverage list
and replace the placeholder:

```html
<span class="zone__time">Quoted per site</span>
<!-- becomes, for example -->
<span class="zone__time">60-90 min STAT</span>
```

Real numbers convert far better than "fast". Only publish a window you can hold.

**Adding a service.** Copy a `<li class="ledger__row">` block in `index.html`
and edit the four parts: the short mono code, the name, the description, and the
turnaround badge. Add `turn--stat` to the badge to make it red; that colour is
reserved for urgency and should stay rare.

**Adding testimonials later.** Use the same ruled pattern as the credentials
list rather than cards. Keep quotes to three lines, and always include name,
role and facility.

---

## 6. Founder photo and story

The About page has a dashed placeholder where your photo goes. It was left empty
on purpose: a generated portrait presented as you would misrepresent a real
person to buyers who are specifically trying to find out who you are.

A phone photo is fine and better than a stock image. Stand near a window, plain
background, no sunglasses, look at the camera. Save it as
`assets/img/joseph-henry.jpg`, roughly 800x1000, then replace the placeholder:

```html
<div class="photo-slot" data-verify="pending"> ... </div>
```

with:

```html
<img src="/assets/img/joseph-henry.jpg" width="800" height="1000"
     style="border-radius:2px"
     alt="Joseph Henry, founder of Bridgeway Medical Logistics.">
```

The two `REPLACE THIS PARAGRAPH` blocks need your actual background. This is the
highest-value writing on the whole site. A practice manager deciding between two
couriers picks the one whose founder obviously understands why a specimen has a
stability window. Plain sentences about where you worked and what you carried
beat any marketing language.

---

## 7. Email address

`josephhenry@gmail.com` is wired in as a placeholder because it is what you
gave me, but it will cost you deals with this audience. A practice manager
vetting vendors reads a Gmail address as a one-person side operation, which is
exactly the doubt this site exists to remove.

Once the domain is registered, a mailbox costs a few dollars a month through
Hostinger. Then update:

```bash
grep -rn 'josephhenry@gmail.com' *.html api/*.php assets/js/site.js
```

---

## 8. Local development

```bash
php -S 127.0.0.1:8000
```

Then open <http://127.0.0.1:8000>. The built-in server runs the PHP endpoint, so
the form can be tested end to end. It does **not** read `.htaccess`, so
redirects, caching headers and clean URLs only take effect on the real host.

---

## 9. Fonts

Self-hosted, no third-party CDN, no external requests, 88KB total.

| Font | Use | Licence |
|---|---|---|
| Archivo | Headings, buttons, wordmark | SIL Open Font License 1.1 |
| Atkinson Hyperlegible | Body text | SIL Open Font License 1.1 |
| Azeret Mono | Phone numbers, codes, timestamps | SIL Open Font License 1.1 |

All three permit self-hosting and commercial use. Atkinson Hyperlegible was
drawn by the Braille Institute specifically for legibility, which is a
deliberate choice for readers scanning compliance details.

---

## 10. What was verified during the build

Not assumed, actually checked:

- Every colour pair against WCAG contrast minimums. Body text 8:1, all
  interactive text above 4.5:1, form borders above the 3:1 required for UI
  components.
- Zero horizontal overflow at 320, 375, 768, 1024 and 1440 px, measured in the
  DOM. A header overflow at 375px was found this way and fixed.
- Every interactive element at 44px minimum touch height. The header phone
  number measured 24px before this was caught.
- Focus rings visible on both white and dark-green surfaces. No single colour
  clears 3:1 on both, so the ring flips to white inside green bands.
- One `<h1>` per page, no skipped heading levels, no images without alt text,
  no form field without a label.
- The form endpoint: rejects GET, returns per-field JSON errors, silently
  absorbs honeypot hits, enforces the rate limit, writes the CSV, and reports
  success correctly when mail fails but logging succeeds.
- All four pages parse with correctly nested tags.

Two bugs found by testing rather than reading: PHP 8.4 deprecated `fputcsv`'s
implicit escape parameter, which was corrupting the JSON response, and
`display_errors` was allowed to print into an API response. Both fixed.

### Not verified

- Live email delivery. That needs your real SMTP credentials and a real domain.
  Send yourself a test submission as the final launch step.
- Rendering below 500px in a real mobile browser. Layout was measured correctly
  at 320 and 375px, but the headless renderer used for screenshots clamps to
  500px, so open the site on your own phone once before launch.
- Anything behind `.htaccess`: HTTPS redirect, caching, clean URLs and the
  security headers only apply on Apache, not the local PHP server.
