# Setu Color Palette & Design Tokens Library

This reference library documents the core color palette tokens, pastel backgrounds, and accessible high-contrast text pairings for the Setu ecosystem.

---

## 1. Primary Colors (Borders & Accents)

Vibrant, calibrated accent colors used for card borders, active indicators, status badges, and interactive highlights.

| Token Name | Hex Code | Swatch | Intended Usage |
| :--- | :--- | :--- | :--- |
| **Indigo / Purple** | `#818CF8` | ![#818CF8](https://via.placeholder.com/14/818CF8/818CF8.png) | AI indicators, Tara Copilot, primary accents |
| **Cyan** | `#22D3EE` *(or `#00BCD4`)* | ![#22D3EE](https://via.placeholder.com/14/22D3EE/22D3EE.png) | Water & sanitation category, live streaming, intake |
| **Emerald / Green** | `#34D399` | ![#34D399](https://via.placeholder.com/14/34D399/34D399.png) | Grassroots citizen portal, resolved works, success |
| **Amber / Orange** | `#FB923C` | ![#FB923C](https://via.placeholder.com/14/FB923C/FB923C.png) | Agriculture, urgent priority, pending review |
| **Pink** | `#F472B6` | ![#F472B6](https://via.placeholder.com/14/F472B6/F472B6.png) | Community initiatives, women self-help groups |
| **Purple** | `#C084FC` | ![#C084FC](https://via.placeholder.com/14/C084FC/C084FC.png) | University research squad badges, R&D labs |
| **Blue** | `#60A5FA` | ![#60A5FA](https://via.placeholder.com/14/60A5FA/60A5FA.png) | Government nodal desks, official administrative actions |
| **Yellow** | `#FACC15` | ![#FACC15](https://via.placeholder.com/14/FACC15/FACC15.png) | Verification warning, triage notices, pending proof |
| **Lavender** | `#A78BFA` | ![#A78BFA](https://via.placeholder.com/14/A78BFA/A78BFA.png) | Academic credits, capstone milestone badges |

---

## 2. Light Mode Pastel Backgrounds

Soft, muted surfaces designed for cards, chip containers, table rows, and callout callout backgrounds in light mode.

| Token Name | Hex Code | Swatch | Paired Primary Accent |
| :--- | :--- | :--- | :--- |
| **Soft Purple** | `#F3E8FF` | ![#F3E8FF](https://via.placeholder.com/14/F3E8FF/F3E8FF.png) | Indigo / Purple (`#818CF8`) |
| **Soft Cyan** | `#E0F7FA` | ![#E0F7FA](https://via.placeholder.com/14/E0F7FA/E0F7FA.png) | Cyan (`#22D3EE`) |
| **Soft Orange** | `#FFF3E0` | ![#FFF3E0](https://via.placeholder.com/14/FFF3E0/FFF3E0.png) | Amber / Orange (`#FB923C`) |
| **Soft Green** | `#E8F5E9` | ![#E8F5E9](https://via.placeholder.com/14/E8F5E9/E8F5E9.png) | Emerald / Green (`#34D399`) |
| **Soft Blue** | `#E3F2FD` | ![#E3F2FD](https://via.placeholder.com/14/E3F2FD/E3F2FD.png) | Blue (`#60A5FA`) |
| **Soft Yellow** | `#FFFDE7` | ![#FFFDE7](https://via.placeholder.com/14/FFFDE7/FFFDE7.png) | Yellow (`#FACC15`) |
| **Soft Pink** | `#FCE4EC` | ![#FCE4EC](https://via.placeholder.com/14/FCE4EC/FCE4EC.png) | Pink (`#F472B6`) |
| **Soft Lavender** | `#EDE7F6` | ![#EDE7F6](https://via.placeholder.com/14/EDE7F6/EDE7F6.png) | Lavender (`#A78BFA`) |

---

## 3. High-Contrast Text Colors

Deep, saturated WCAG AA / AAA accessible text colors calibrated for readable typography on white, pastel, or tinted backgrounds.

| Token Name | Hex Code | Swatch | Intended Role |
| :--- | :--- | :--- | :--- |
| **Dark Charcoal (Leaf Text)** | `#0F172A` | ![#0F172A](https://via.placeholder.com/14/0F172A/0F172A.png) | Primary body text, labels, metadata |
| **Deep Purple (Header Text)** | `#581C87` | ![#581C87](https://via.placeholder.com/14/581C87/581C87.png) | Purple card headlines, AI summary headers |
| **Deep Cyan (Header Text)** | `#006064` | ![#006064](https://via.placeholder.com/14/006064/006064.png) | Water & sanitation headlines |
| **Deep Orange (Header Text)** | `#7C2D12` | ![#7C2D12](https://via.placeholder.com/14/7C2D12/7C2D12.png) | Urgent alert headers, agriculture notes |
| **Deep Green (Header Text)** | `#064E3B` | ![#064E3B](https://via.placeholder.com/14/064E3B/064E3B.png) | Resolution headers, verified status text |
| **Deep Blue (Header Text)** | `#1E3A8A` | ![#1E3A8A](https://via.placeholder.com/14/1E3A8A/1E3A8A.png) | Government command headers |
| **Deep Amber (Header Text)** | `#713F12` | ![#713F12](https://via.placeholder.com/14/713F12/713F12.png) | Warning notices, audit banners |
| **Deep Pink (Header Text)** | `#831843` | ![#831843](https://via.placeholder.com/14/831843/831843.png) | Community highlight headers |
| **Deep Violet (Header Text)** | `#4C1D95` | ![#4C1D95](https://via.placeholder.com/14/4C1D95/4C1D95.png) | Capstone & university research titles |

---

## 4. Recommended Harmony Triads (Card & Badge Combinations)

Use these pre-calculated combinations to ensure automatic WCAG compliance:

```
┌────────────────────────────────────────────────────────┐
│ 1. Government & Administrative Cluster                │
│    Background: #E3F2FD (Soft Blue)                    │
│    Border:     #60A5FA (Blue)                         │
│    Text:       #1E3A8A (Deep Blue)                    │
├────────────────────────────────────────────────────────┤
│ 2. Citizen & Verified Environmental Cluster            │
│    Background: #E8F5E9 (Soft Green)                   │
│    Border:     #34D399 (Emerald / Green)              │
│    Text:       #064E3B (Deep Green)                   │
├────────────────────────────────────────────────────────┤
│ 3. Water Sanitation & Real-time Sensor Cluster         │
│    Background: #E0F7FA (Soft Cyan)                    │
│    Border:     #22D3EE (Cyan)                         │
│    Text:       #006064 (Deep Cyan)                    │
├────────────────────────────────────────────────────────┤
│ 4. Urgent Infrastructure & Agricultural Cluster        │
│    Background: #FFF3E0 (Soft Orange)                  │
│    Border:     #FB923C (Amber / Orange)               │
│    Text:       #7C2D12 (Deep Orange)                  │
├────────────────────────────────────────────────────────┤
│ 5. University Capstone & AI Research Cluster          │
│    Background: #F3E8FF (Soft Purple)                  │
│    Border:     #818CF8 (Indigo / Purple)              │
│    Text:       #581C87 (Deep Purple)                  │
└────────────────────────────────────────────────────────┘
```

---

## 5. Usage in Code

### In JavaScript / React
```javascript
import { 
  PRIMARY_COLORS, 
  PASTEL_BACKGROUNDS, 
  TEXT_COLORS, 
  COLOR_HARMONIES 
} from '@/constants/colors';

// Example: Badge
<span style={{ 
  backgroundColor: PASTEL_BACKGROUNDS.softGreen, 
  borderColor: PRIMARY_COLORS.emerald, 
  color: TEXT_COLORS.deepGreen 
}}>
  Resolved Issue
</span>
```

### In CSS
```css
.my-card-cyan {
  background-color: var(--color-pastel-cyan);
  border: 1px solid var(--color-primary-cyan);
  color: var(--color-text-deep-cyan);
}
```
