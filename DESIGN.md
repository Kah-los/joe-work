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
- Editorial-typographic: display serif, italic, small mono labels, ruled
  separators, monochrome restraint. The first build landed squarely in this
  lane while claiming to avoid it. The rebuild removed monospace entirely and
  every hairline-ruled row, which is what actually got it out.

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
inside `.on-dark`, so the ring is seal-red on light surfaces and white on green.
Verified by rendering both states.

## Type

**One family: Libre Franklin**, weights 400 / 600 / 900 from a single variable
file. 29KB, SIL OFL, self-hosted, no CDN.

Franklin Gothic is the American institutional and public-signage lineage: the
actual typographic register of official documents, which is what this brand is
borrowing authority from. Hierarchy comes from committed weight and size
contrast (400 body against 900 display) rather than from a second typeface.

**No monospace anywhere.** Numbers use this family's tabular figures via
`font-variant-numeric`.

### Why the first attempt failed

The first build used Archivo + Atkinson Hyperlegible + Azeret Mono. Three
problems, all self-inflicted:

- `typeset.md` is explicit that one well-chosen family in multiple weights
  produces cleaner hierarchy than competing typefaces. Three was indulgent.
- Atkinson Hyperlegible was chosen on a substance argument about legibility
  without checking how it actually set in running body copy. It reads wide and
  institutional-cheap at paragraph length. Craft lost to rationalisation.
- Mono-caps labels ended up on the hero eyebrow, every section label, every
  form label, the service codes and the footer headers. `brand.md` names that
  exact combination as a saturated lane. Mono on decorative labels is costume.

### Scale

Six steps at roughly a 1.33 ratio, with a deliberate jump to display so
hierarchy reads instantly. Body and small are fixed; headings are fluid via
`clamp()`. Every clamp keeps max under 2.5x min so zoom and reflow behave.

Vertical rhythm derives from the body line-height: 17px at 28px leading, so
`--r: 1.75rem` is the base unit and every vertical space is a multiple of it.

Light type on the green loses perceived weight on three axes, so all three are
compensated: leading +0.06, tracking +0.012em, and weight 400 → 450 (available
because the family is variable).

The fallback is metric-matched using values measured out of the font binary
(x-height 0.530, ascent 96.6%, descent 24.6%), so text does not reflow when the
web font arrives.

## Layout

### Why the first attempt failed

The first build claimed six distinct layout families and actually had three.
Credentials, services, coverage zones and driver standards were all the same
thing: a hairline-ruled row with a label left and text right. `taste-skill`
bans that twice over, once as section-layout repetition and once as
`border-t` + `border-b` on every row of a list. Four sections in one costume
is most of why the page read as machine-made.

### What replaced it

Sections are now separated by colour, whitespace and composition. No rules
between rows anywhere, no pill badges, no eyebrows at all.

1. **Hero.** Asymmetric, and the photograph bleeds to the right viewport edge
   rather than sitting in a tidy half. The copy column carries its own padding
   via `max(gutter, 50vw - half + gutter)` so it still aligns with every
   section below while the image escapes the container.
2. **Credentials.** Four columns on the green, held apart by space alone.
   Headings reserve two lines so the paragraphs share a baseline.
3. **Services.** A two-by-two grid of blocks. Two dimensions rather than a
   one-dimensional list, separated by space rather than hairlines. Turnaround
   is bold text, not a bordered pill.
4. **Coverage.** A full-width typographic statement ("Five boroughs. Western
   Long Island. Northern New Jersey.") that *is* the heading, then three zone
   columns. No table, no rules.
5. **Quote.** Form split on the green. Labels are sentence case, not tracked
   small caps.
6. **Footer.**

Container `72rem`, gutter `clamp(1.25rem, 4vw, 2.5rem)`, section padding
`clamp(3.5rem, 7vw, 7rem)`. All vertical space is a multiple of the `1.75rem`
rhythm unit.

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

One generated photograph, used in two crops: gloved hands applying a numbered
security seal to a sealed transport cooler, chain-of-custody form on the lid.
Its red seal happens to match `--seal-red`. The homepage uses the tall crop
bleeding off the right edge; About uses a landscape band from the same frame.

Only one source frame exists, and it is 928px wide. That is why the hero is a
bleeding column rather than a true full-bleed banner: a full-width banner would
need upscaling and would ship soft. Additional photography needs either
Joseph's own images or a licensed stock budget. Unsplash was unreachable from
this environment and generic van stock would read as cheap for this brand, so
the site is not padded with it. One decisive photo beats five mediocre ones.

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
