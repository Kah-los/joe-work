# Design system

Hand-authored CSS in `assets/css/site.css`, organised in numbered sections.
Everything below is a token in `:root`.

## Aesthetic lane

**Bonded instrument.** Reference set: the deep green intaglio of a bond
certificate, a carbon-copy chain-of-custody form on an aluminium clipboard, a
Port Authority signage plate.

The reasoning: the buyer is not buying *medical*, they are buying *documented and
accountable*. So the visual world is the security-document and waybill world,
not the clinic world.

**What this deliberately avoids**

- **Healthcare blue.** The first-order reflex for anything medical, and the
  reason most courier sites are interchangeable. The palette tool suggested a
  sky-blue seed at hue 210; it was overridden on purpose.
- Cream background with terracotta accent (the saturated warm-craft default).
- Dark mode with a neon accent.
- SaaS gradient hero.
- Editorial-typographic (display serif, italic, monochrome restraint). The ruled
  structure here flirts with that lane, so the rules and mono only ever carry
  real manifest content. Mono on decorative labels would tip it over.

## Colour

Committed strategy: green carries the hero-adjacent bands and the quote section
outright; white carries the content. Ratios were computed, not estimated.

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `--paper` | `#FFFFFF` | primary surface | |
| `--band` | `#EDF3EF` | alternating band, faint green tint | |
| `--ink` | `#12171B` | body and headings | 16.0:1 on paper |
| `--ink-muted` | `#47534E` | secondary text | 8.0:1 paper, 7.1:1 band |
| `--bond-800` | `#0E3A2C` | **primary brand**, hero strip + quote band | 12.7:1 w/ white |
| `--bond-900` | `#0A2E23` | footer | 14.7:1 w/ white |
| `--bond-600` | `#17614A` | links, hover | 7.4:1 on paper |
| `--seal-red` | `#B0221D` | STAT/urgency only, focus ring on light | 6.8:1 on paper |
| `--rule` | `#C3CEC7` | hairlines | 1.6:1 |
| `--rule-strong` | `#6F7E76` | form borders | 4.3:1, clears WCAG 1.4.11 |
| `--on-bond-muted` | `#A9C4B8` | secondary text on green | 6.8:1 |

**Pure white, not off-white.** A requisition form is printed on white stock, and
any warm tint slides toward the cream default.

**Red is functional and capped near 5%.** It marks STAT service and urgency only,
so it still means something. Never decorative.

**Focus ring flips.** No single colour clears 3:1 on both white and deep green
(`--seal-red` is 6.8:1 on white but 1.9:1 on green). `--focus` is redefined
inside `.on-bond`, so the ring is seal-red on light surfaces and white on green.
Verified by rendering both states.

## Type

Voice words: **sealed, timed, accountable.**

Reflex picks were Inter, IBM Plex Mono and Space Grotesk. All three are on the
reflex-reject list, so all three were rejected.

| Role | Font | Why |
|---|---|---|
| Display | **Archivo** 700/800, tight tracking | A newspaper-and-forms grotesque. Squared and bureaucratic in the right way, characterful without being a costume, which matters for readers who parse flashy as risky. |
| Body | **Atkinson Hyperlegible** 400/700 | Drawn by the Braille Institute for unambiguous legibility. Pairs with Archivo on a real contrast axis (humanist against neo-grotesque) rather than the two-similar-grotesques mistake. The substance argument is genuine for readers scanning compliance detail. |
| Mono | **Azeret Mono** 400/500 | Phone numbers, service codes, turnarounds, timestamps. Tabular numerals. |

Three families, at the cap. All SIL OFL, self-hosted, 88KB total, no CDN.

Scale is fluid `clamp()` with ratio ≥1.25. Hero maxes at `3.75rem`: the ceiling
is set by column width, not by how large the type could go. At 68px the headline
wrapped to four lines, which is a font-size error.

## Layout

Six distinct families across the homepage, so nothing repeats:

1. Asymmetric split hero (1.08fr / 0.92fr, not 50/50)
2. Full-width ruled custody strip on green
3. Ruled definition list, credentials
4. **Ledger table**, services. Deliberately not three equal cards: one row per
   service with a mono code, name, description and turnaround, which is both the
   manifest aesthetic doing real work and the format the buyer wants to scan.
5. Two-column coverage, copy against a zone ledger
6. Quote band on green, form styled as a requisition

Container `72rem`, wide bands `84rem`, gutter `clamp(1.25rem, 4vw, 2.5rem)`.
Section rhythm alternates `--section-y` and `--section-y-t`.

One radius system throughout: `2px`, near-square.

### Header

Brand, dispatch number and links share one row from `48rem` up. Below that the
row needs 520px in a 375px viewport, so the links drop to a second row and the
number stays beside the wordmark. The number is the conversion and is never what
gets dropped. A two-row header is only a defect at desktop.

The phone number is a sibling of `<nav>`, not inside it: a contact action is not
navigation, and it makes the two-row reflow trivial.

### No map

The coverage section lists zones rather than drawing a map. An accurate map needs
real boundary data; an inaccurate one is worse than a list to a reader who knows
these counties better than we do. An earlier concentric-circle diagram was cut
for exactly this reason, since the zones are not radial.

## Imagery

One hero photograph, generated: gloved hands applying a numbered security seal
to a sealed transport cooler, chain-of-custody form on the lid. Its red seal
happens to match `--seal-red`.

One decisive photo beats five mediocre ones, so the page is not padded with
unrelated stock. Height is constrained in CSS (`clamp(19rem, 36vw, 29rem)` with
`object-fit: cover`) because at native 4:5 it rendered ~810px tall against ~420px
of copy and left the headline floating.

No div-built product mockups anywhere. The founder photo is an explicit empty
slot: a generated portrait presented as Joseph would misrepresent a real person.

## Motion

Section 17 of the stylesheet. One orchestrated hero moment: the eyebrow rule
draws in, then eyebrow, headline, lead, buttons and image settle on staggered
delays totalling roughly 600ms. Then the page is still. Nothing animates on
scroll.

Written as `@media (prefers-reduced-motion: no-preference)` so content is
visible by default and motion is added. A reveal that gates visibility ships
blank in headless renderers and background tabs.

## Print

Practice managers print vendor sheets for procurement files, so there is a print
stylesheet: green bands flatten to white, nav/form/image drop out, links show.
