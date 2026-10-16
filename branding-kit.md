# Alveo Land branding kit

Source: [https://www.alveoland.com.ph/](https://www.alveoland.com.ph/), reviewed 17 October 2026.

Pages read: homepage, [About Us](https://www.alveoland.com.ph/about-us/), [Properties](https://www.alveoland.com.ph/properties/), [Contact Us](https://www.alveoland.com.ph/contact-us/). Navigation also exposes Locations, Commtalk, and Careers (“Join Team Alveo”).

How colors and type were measured: live `getComputedStyle` through Chrome DevTools Protocol on the production site (homepage at the default headless viewport, then a second pass at 1440×900). Hex values below are converted from those computed `rgb()` values unless a row says **declared in CSS**. Nothing here is guessed from a screenshot.

The Cursor IDE browser could not keep a tab open (`No browser tab available` / view not found after `browser_tabs` created one). The measurements are still from the live DOM, not from a static stylesheet guess. Elementor’s global kit tokens are listed separately because they are **not** what the page paints.

## Brand snapshot

Alveo Land is Ayala Land’s upscale residential arm. The public site positions it as a premium Philippine developer of condos, residential lots, offices, and commercial lots in growth centers across the country. The repeated promise is a place for **living and working well**, written for a “discerning market,” with master-planned communities rather than one-off listings.

Meta description: “Alveo Land caters to the upscale market with its dynamic portfolio of residential, business, commercial, and leisure developments across the country.”

A personal site for the saleswoman should **inherit**:

- The navy and teal palette, white wordmark on navy, and Inter / Poppins pairing.
- Uppercase, widely tracked section labels and thin white or teal arrow buttons.
- Photography of real Alveo places: dusk skylines, aerial master plans, amenity and facade shots. Wide, quiet, low-clutter layouts.
- The corporate line “living and working well,” and the relationship to Ayala Land and Alveo. She is a guide into that portfolio, not a separate brand.
- Institutional calm. The company speaks as “we” and “our dedicated teams,” and addresses the buyer as “you.”

A personal site should **keep personal** (none of this is on the corporate site yet):

- Her name, portrait, direct mobile number, and personal email.
- The projects and cities she actually sells, her years with Alveo, and any license or accreditation she wants public.
- A first-person introduction. Corporate copy never uses a salesperson’s voice. Her page can say “I” once the facts are real. It should still sound measured, not like a hard close.
- Testimonials, a short bio, and a direct inquiry path that reaches her, while the company hotline and `info@alveoland.com` stay available as the corporate backup.

### Identity fields still needed

The saleswoman’s name is not known. Do not invent one. Still needed before design or copy:

- Full name, and the exact title she uses (the brief says senior saleswoman; the website does not confirm a job title for her).
- Portrait she is allowed to publish, and whether a white-logo-on-navy header should sit beside it.
- Mobile, email, Viber or other contact she wants public.
- Cities and projects she covers.
- Years with Alveo, languages, and any PRC, DHSUD, or broker accreditation she wants shown.
- One or two facts that are hers (not corporate awards copied from About).

## Color palette

| Role | Hex | Where observed |
| --- | --- | --- |
| Primary navy | `#002B47` | Computed header background on About, Properties, and Contact. Computed footer background on every page. Computed homepage bands (“One of the Philippines’ leading…”, “Explore Alveo’s portfolio”). Menu overlay is the same hex in CSS. Hero scrim ends at `#002B47` (declared in homepage CSS). |
| Action teal | `#006895` | Computed Contact heading “SEND US A MESSAGE”. Computed “Read more” / awards link color on About (`rgb(0, 104, 149)`). Computed cookie **Allow** fill. Computed contact submit button fill. Declared as homepage column fills and the homepage form submit (`background: #006895`, Poppins, white text). |
| Page background | `#FFFFFF` | Computed `body` background. |
| Ink | `#000000` | Computed “FEATURED PROPERTIES”, “OUR LOCATIONS”, About section headings, and property-card titles. |
| Body default | `#5C727D` | Computed `body` and header text color. Theme chrome; designed paragraphs are usually white or black instead. |
| Footer and hero type | `#FFFFFF` | Computed hero title, hero tagline, and nav links. |
| Footer copy | `#F0F0F0` | Computed footer color, footer “Contact Us” title, description, and email link. |
| Card meta | `#4F4F4F` | Computed property location line (“DAVAO”). Also declared on `.featured_peropert_box_city`. |
| Form label | `#4F575E` | Computed Contact label “Inquiry Type *”. |
| Form field border | `#BCBFC3` | Computed Contact text input border. Field fill `#FFFFFF`, text `#000000`. |
| Soft surface | `#FBFBFB` | **Declared in CSS** on `.alveo_meta_filter_container` (property filters), not recomputed as a filled region in the sample. |
| Form error | `#DC2020` | **Declared in CSS** on the homepage HubSpot-style form (border and error text). Not measured on a visible error state. |
| Near-white button label | `#FEFEFE` | **Declared in CSS** on the homepage submit (`color: #fefefe`) together with fill `#006895`. |

Do not treat these as the brand. They are Elementor kit defaults on `.elementor-kit-35`, still present as CSS variables, and largely overridden:

- `--e-global-color-primary: #6EC1E4`
- `--e-global-color-secondary: #54595F`
- `--e-global-color-text: #7A7A7A`
- `--e-global-color-accent: #61CE70`

Some Elementor buttons report `background-color: rgba(97, 206, 112, 0)`, so the green token is in the cascade at zero opacity. The visible button is white type on a photo or navy field.

Also skip:

- `#0073E1` — computed on a “Send” control in the homepage chrome (Assistant, capitalize). It sits apart from Alveo’s teal submit. Treat as a third-party widget.
- `#2D4156` — computed Decline label from the cookie banner’s own UI font, not Alveo type.
- `#012B47` and `#072B47` — declared a handful of times in child CSS. They are near the navy, not a second brand color. Use measured `#002B47`.
- `#98C3D1` — declared only on `.image-source-link` in a lightbox stylesheet.

## Typography

Google Fonts stylesheet (exact link on every page measured):

`https://fonts.googleapis.com/css?family=Assistant:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic|Inter:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic|Poppins:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic&display=swap`

A second Google Fonts link loads **Roboto** 300, 400, 500, 700 for the WP Residence theme. Roboto is not the voice of the designed pages. Font Awesome is the icon font.

| Family | Weight | Size / line-height | Use |
| --- | --- | --- | --- |
| Inter | 500 | 28px / 30px, letter-spacing 1.6px, uppercase | Homepage hero “ALVEO LAND”. White. |
| Inter | 400 | 16px / 24px, letter-spacing 1.6px, uppercase | Hero line “LIVE WELL ALL ACROSS THE PHILIPPINES”. Computed stack on that `p` is `Inter, serif`. |
| Inter | 400 | 20px / 24px or 32px, letter-spacing 1.6px, uppercase | Section labels: “FEATURED PROPERTIES”, “OUR LOCATIONS”, “LIVE WELL WITH ALVEO”, “OUR FOUNDATION”. Black on white, white on photography. |
| Inter | 300 | 20px / 24px, letter-spacing 1.6px, uppercase | “ABOUT ALVEO LAND” on the homepage. |
| Inter | 400 | 28px / 32px, letter-spacing 1.6px, uppercase | Property card title, e.g. “PATIO SUITES ABREEZA”. Black. |
| Inter | 400 | 16px / 24px | Body paragraphs in designed sections, including the About lead. Color is white on photography and black on white. Computed stack is often `Inter, serif`. |
| Inter | 400 | 20px / 24px, letter-spacing 1.6px, uppercase | Overlay nav links (“About Alveo”). White. Padding 4px 0. |
| Inter | 600 | 21px / 30px | Footer heading “Contact Us”. `#F0F0F0`. |
| Inter | 400 | 18px / 28px | Footer description and email. `#F0F0F0`. |
| Inter | 500 | 28px / 50px, letter-spacing 1.6px, uppercase | Contact page “SEND US A MESSAGE”. `#006895`. |
| Inter | 400 | 14px / 28px | Contact form labels. `#4F575E`. |
| Poppins | 400 | 16px / 24px, uppercase | Homepage search button. White, 1px white border, transparent fill. |
| Poppins | 500 | 16px / 24px, uppercase | “VIEW ALL PROPERTIES” and “READ MORE ABOUT ALVEO”. White, transparent fill, 3px radius, padding 8px 0. Arrow icon sits to the right. |
| Poppins | 500 | 16px, uppercase | Contact submit. Fill `#006895`, label white, padding 8px 16px, radius 0. |
| Assistant | 400 | 14px / 14px | Computed `body` and `.master_header`. Color `#5C727D`. This is the theme default under the designed Inter layer. |
| Assistant | 600 | Kit token only | `--e-global-typography-primary-font-family: "Assistant"` at weight 600. Overridden on real headings by Inter. |

Letter-spacing `1.6px` on uppercase Inter labels is the most reliable type cue to echo. Headings are not bold display type; they are light or regular, tracked, and uppercase.

## Tone of voice

Principles, taken from the copy rather than from a brand book (none is published):

- Institutional and calm. The company is the subject, or “we,” never a named agent.
- The buyer is “you.” The offer is a place to live and work well, not a discount or a countdown.
- Sentences are complete and slightly formal. Location blurbs are short and civic (“fastest urbanizing,” “economic and cultural landscape”).
- Labels are uppercase. Body sentences are sentence case.
- Proof is specific when it shows up (awards, project names, a hotline), and boastful lines stay tied to Ayala Land’s record (“largest and most experienced,” “more than 35 years”).

Do:

- “As Ayala Land’s upscale residential arm, Alveo offers a dynamic portfolio of prime spaces for living and working well, set within thriving and emerging growth centers all across the Philippines.”
- “Every Alveo Land development nurtures individuals and hard-earned investments with a singular vision: giving you a place for living and working well.”
- “Allow us to walk you through what you need to know before choosing to invest with Alveo Land.”
- “Our dedicated teams are ready to assist you with needed information on Alveo Land properties, wherever you are.”

Don’t:

- Don’t add urgency, slang, or exclamation points. The site doesn’t (“Check our guide”, “Send us a message”, “Read more about Alveo”).
- Don’t speak as if the saleswoman is the developer. “Armed with sharper foresight, unparalleled excellence, and total commitment” is corporate, and it is already as far as the brand goes toward self-praise.
- Don’t rename the tagline. The hero is “live well all Across the PHILIPPINES”; About says “LIVE WELL WITH ALVEO”. Keep “live / living well.”
- Don’t mimic the Elementor kit or the cookie banner. Cookie copy is legal UI, and its font is the browser system stack.

## Public assets

Use these URLs. Do not bulk-download photography into the repo. Hotlink only if the designer’s preview needs it; for production, confirm rights with Alveo before copying files onto a personal domain.

| URL | What it is | Usage note |
| --- | --- | --- |
| `https://www.alveoland.com.ph/app/uploads/2023/04/Alveo-white-e1682887996202.png` | Header wordmark, white “ALVEO” | Computed `img#logo_image`. Use on navy or photography. No dark wordmark was found. |
| `https://www.alveoland.com.ph/app/uploads/2023/09/alveo-logo-white-small.png` | Footer wordmark (full file; 300, 768, and 1024 widths also exist) | Same-origin `srcset`. The footer `img` `src` currently points at `https://dev.alveo.make.technology/app/uploads/2023/09/alveo-logo-white-small-300x155.png`. Prefer the production host. |
| `https://www.alveoland.com.ph/app/uploads/2025/07/09-2025-Seal-of-Registration-Alveo-Land-Corporation.png` | DHSUD-style seal of registration | Footer, links to the privacy policy. Use only if the personal site is clearly an official Alveo channel. |
| `https://www.alveoland.com.ph/app/uploads/2024/05/Alveo-Website-Homepage-1.mp4` | Homepage hero video | Full-bleed, muted, looping. Personal site should not autoplay this as if it were her film; a still from an Alveo place is enough. |
| `https://www.alveoland.com.ph/app/uploads/2023/08/BGC.jpg` | BGC skyline still (also the Open Graph image) | 1920×1080. City-at-dusk photography. |
| `https://www.alveoland.com.ph/app/uploads/2023/07/icon-long-white-arrow.svg` | Long arrow, white | Homepage search button. |
| `https://www.alveoland.com.ph/app/themes/wpresidence-child/src/images/icons/icon-long-arrow-blue.svg` | Long arrow, blue | Location-card “Read More”. |
| `https://www.alveoland.com.ph/app/themes/wpresidence-child/src/images/icons/icon-marker.svg` | Map pin | Property and location maps. |
| `https://www.alveoland.com.ph/app/themes/wpresidence-child/images/search.png` | Header search icon | White, on the transparent or navy bar. |
| `https://www.alveoland.com.ph/app/themes/wpresidence-child/images/nav.png` | Header menu icon | Paired with the wordmark. |
| `https://www.alveoland.com.ph/app/themes/wpresidence-child/images/map_pointer.png` | Small map pin on property cards | With building and tag icons below. |
| `https://www.alveoland.com.ph/app/themes/wpresidence-child/images/building.png` | Card meta icon | Property type. |
| `https://www.alveoland.com.ph/app/themes/wpresidence-child/images/tag.png` | Card meta icon | Status such as pre-selling. |

Photography already public on the homepage (representative, not a full library):

- `https://www.alveoland.com.ph/app/uploads/2023/12/Patio-Suites-Abreeza-835x467.png`
- `https://www.alveoland.com.ph/app/uploads/2023/12/MERGENT-RESIDENCES-Pool-Area-835x467.jpg`
- `https://www.alveoland.com.ph/app/uploads/2023/12/SENTROVE-835x467.jpg`
- `https://www.alveoland.com.ph/app/uploads/2023/12/CALLISTO-835x467.jpg`
- `https://www.alveoland.com.ph/app/uploads/2017/12/ASTELA-10-835x467.jpg`
- `https://www.alveoland.com.ph/app/uploads/2023/12/WESTBOROUGH-2-1-835x467.jpg`
- `https://www.alveoland.com.ph/app/uploads/2023/12/HILLSIDE-RIDGE-Clubhouse-2-835x467.jpg`
- `https://www.alveoland.com.ph/app/uploads/2023/12/South-Palmgrove-Guardhouse-Aerial-View.jpg`
- `https://www.alveoland.com.ph/app/uploads/2023/12/Makati-Skyline-1.jpg`
- `https://www.alveoland.com.ph/app/uploads/2023/06/Cerca-Whole-Development-Plan.jpg`
- `https://www.alveoland.com.ph/app/uploads/2024/03/HQ-1-1-768x487.png` (headquarters still in the homepage markup)

`https://www.alveoland.com.ph/app/themes/wpresidence/img/logo_mobile.png` is the theme’s mobile logo, alt text “image”. It is not the Alveo wordmark. Do not use it.

Arrow motif in the button SVG: a 21×12 stroke path, stroke width about 1.17, white on navy and photography. The location card uses the same arrow in teal.

Corporate contact, for the footer pattern only:

- Hotline `(+632) 8848 5000`
- `info@alveoland.com`
- Alveo Corporate Center, 728 28th Street, Bonifacio Global City, 1634 Taguig City
- [Facebook AlveoLand](https://www.facebook.com/AlveoLand), [Instagram @alveolandcorp](https://www.instagram.com/alveolandcorp), [YouTube AlveoLandCorp](https://www.youtube.com/AlveoLandCorp), [LinkedIn alveoland](https://www.linkedin.com/company/alveoland)
- [Access Ayala](https://access.ayalaland.com/)

## Layout and imagery patterns

- Homepage header is transparent over a full-bleed video. Inner pages use a solid `#002B47` bar, white wordmark, hamburger, and search. The full menu overlay is the same navy (declared `#002B47`, padding about 56px 100px on the top row).
- Hero type is small for the viewport: 28px Inter medium, not a huge display face, plus a 16px tracked uppercase tagline. A hairline search field sits on the image (Inter 20px, white, transparent).
- Navy bands alternate with white content. White bands carry black uppercase labels and large photos. Navy bands carry white uppercase lines and text-style buttons with an arrow, not filled pills.
- Property cards are photo-first (image area about 350px tall, `object-fit: cover`), then an uppercase title, a `#4F4F4F` location, small meta icons, and a teal uppercase link. Little or no card border or shadow on the listing itself.
- Location modules pair a map with a photo card and a one-sentence civic blurb ending in “Read More” plus the blue arrow.
- The About hero is a dusk city photograph with white body copy over it. Breadcrumbs are small: “Home › ABOUT ALVEO”.
- Contact is a white page: teal uppercase title, then a simple stacked form (labels `#4F575E`, fields white with `#BCBFC3` borders, teal uppercase submit).
- Density is low. Sections are tall, type is modest, and photography does the selling.
- Buttons to echo: either a transparent uppercase label with a thin arrow (Poppins 500, 16px, white or teal), or a flat `#006895` rectangle with square corners and white Poppins 500. Avoid heavy rounding. The 3px radius on some Elementor links is barely visible.
- Footer is `#002B47` with `#F0F0F0` Inter copy, the white logo, the registration seal, address, and social names written out beside icons.

## Gaps and assumptions

- The saleswoman is not named, pictured, or quoted anywhere reviewed. “Senior saleswoman” comes from the project brief, not from alveoland.com.ph.
- Cursor’s browser tab could not be held. Computed styles and screenshots were taken with headless Chrome 155 against the live site. Screenshots at the default viewport were partly covered by the cookie banner, so color decisions follow `getComputedStyle`, not the screenshot.
- The properties archive painted “72 PROPERTIES” and then “No result found” in that headless session, so listing-card metrics were taken from the homepage carousel, and the filter-bar fill `#FBFBFB` is from CSS only.
- Elementor kit colors (`#6EC1E4`, `#61CE70`, `#54595F`, `#7A7A7A`) and Assistant-as-primary-heading are installed but overridden. Using them would make the personal site look like an unstyled Elementor kit.
- A dark or one-color logo file was not found. Only white wordmarks were in the header and footer.
- The footer image `src` points at a `dev.alveo.make.technology` host. The same asset exists on `www.alveoland.com.ph`.
- `#DC2020` was not seen in an active error state. `#0073E1` is a widget, not a brand button.
- Some computed `font-family` values are `Inter, serif` because that is the specified stack. Inter did load through Google Fonts; the serif is the fallback.
- Copyright line on the site still reads “© 2024 Alveo Land Corp.”
- No written brand guidelines, logo clear-space, or approved co-brand rules for agents were published on these pages. A personal site that uses the wordmark should be confirmed with Alveo before launch.
