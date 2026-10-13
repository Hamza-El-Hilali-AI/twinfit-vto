import type { Garment } from "../types";

const svgToDataUrl = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

const makeTee = () =>
  svgToDataUrl(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 880">
    <defs>
      <linearGradient id="fabric" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f7f2e9"/>
        <stop offset="1" stop-color="#ded5c7"/>
      </linearGradient>
    </defs>
    <path d="M255 84h210l72 56 104 40c23 9 35 36 26 59l-54 132-116-44 10 430c1 24-18 43-42 43H255c-24 0-43-19-42-43l10-430-116 44-54-132c-9-23 3-50 26-59l104-40 72-56Z" fill="url(#fabric)" stroke="#9f9485" stroke-width="10" stroke-linejoin="round"/>
    <path d="M268 91c17 55 48 83 92 83s75-28 92-83" fill="none" stroke="#b8aa9a" stroke-width="14" stroke-linecap="round"/>
    <path d="M239 338h242M240 449h240M238 560h244" stroke="#cfc3b4" stroke-width="8" opacity=".55"/>
    <circle cx="360" cy="236" r="8" fill="#8d8174"/>
    <circle cx="360" cy="284" r="8" fill="#8d8174"/>
  </svg>`);

const makeBlazer = () =>
  svgToDataUrl(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 880">
    <defs>
      <linearGradient id="navy" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#273244"/>
        <stop offset="1" stop-color="#0e1726"/>
      </linearGradient>
    </defs>
    <path d="M260 80h200l70 62 95 35c23 9 36 34 29 58l-57 202-95-35 26 352c2 28-20 52-48 52H240c-28 0-50-24-48-52l26-352-95 35-57-202c-7-24 6-49 29-58l95-35 70-62Z" fill="url(#navy)" stroke="#121826" stroke-width="10" stroke-linejoin="round"/>
    <path d="M279 104 360 434l81-330 62 52-74 146 72 94-82 410H301l-82-410 72-94-74-146 62-52Z" fill="#1b2536" opacity=".95"/>
    <path d="M321 426h78M323 486h74M325 546h70" stroke="#d4b56f" stroke-width="10" stroke-linecap="round"/>
    <path d="M230 402h94M396 402h94" stroke="#657087" stroke-width="9" opacity=".55"/>
  </svg>`);

const makeDress = () =>
  svgToDataUrl(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 880">
    <defs>
      <linearGradient id="emerald" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#2aa881"/>
        <stop offset=".55" stop-color="#17795f"/>
        <stop offset="1" stop-color="#0e4f43"/>
      </linearGradient>
    </defs>
    <path d="M286 82h148l62 92c28 41 42 89 39 138l-16 282 82 195c7 18-6 37-25 37H144c-19 0-32-19-25-37l82-195-16-282c-3-49 11-97 39-138l62-92Z" fill="url(#emerald)" stroke="#0f594a" stroke-width="10" stroke-linejoin="round"/>
    <path d="M284 89c24 67 49 101 76 101s52-34 76-101" fill="none" stroke="#a7e0cb" stroke-width="12" stroke-linecap="round"/>
    <path d="M216 592c92 42 196 42 288 0M188 711c114 52 230 52 344 0" stroke="#88cab5" stroke-width="9" opacity=".58"/>
    <path d="M251 289c54 30 164 30 218 0" fill="none" stroke="#bce7d8" stroke-width="10" opacity=".65"/>
  </svg>`);

const makeHoodie = () =>
  svgToDataUrl(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 880">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#d8edf3"/>
        <stop offset="1" stop-color="#6fa4b5"/>
      </linearGradient>
    </defs>
    <path d="M268 72h184c58 39 90 99 96 180l82 47c20 12 28 36 18 57l-76 163-77-35 15 277c1 24-18 43-42 43H252c-24 0-43-19-42-43l15-277-77 35-76-163c-10-21-2-45 18-57l82-47c6-81 38-141 96-180Z" fill="url(#sky)" stroke="#4d7886" stroke-width="10" stroke-linejoin="round"/>
    <path d="M273 104c-12 71 17 123 87 156 70-33 99-85 87-156" fill="#8eb9c6" stroke="#4d7886" stroke-width="10"/>
    <path d="M282 458h156c25 0 45 20 45 45v69H237v-69c0-25 20-45 45-45Z" fill="#78aaba" stroke="#4d7886" stroke-width="8"/>
    <path d="M321 245c-9 72-20 126-34 162M399 245c9 72 20 126 34 162" stroke="#f7fbfc" stroke-width="8" stroke-linecap="round"/>
  </svg>`);

const makeTrench = () =>
  svgToDataUrl(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 880">
    <defs>
      <linearGradient id="clay" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#b86454"/>
        <stop offset="1" stop-color="#612f32"/>
      </linearGradient>
    </defs>
    <path d="M251 76h218l64 66 100 35c23 8 36 33 30 56l-55 228-91-31 28 366c2 25-18 46-43 46H218c-25 0-45-21-43-46l28-366-91 31-55-228c-6-23 7-48 30-56l100-35 64-66Z" fill="url(#clay)" stroke="#4c2529" stroke-width="10" stroke-linejoin="round"/>
    <path d="M274 94 360 434l86-340 58 57-85 154 93 91-96 446H304l-96-446 93-91-85-154 58-57Z" fill="#7b3c3e" opacity=".92"/>
    <path d="M222 409h276M218 465h284" stroke="#d8a29a" stroke-width="13" stroke-linecap="round"/>
    <circle cx="324" cy="535" r="11" fill="#331a1d"/>
    <circle cx="396" cy="535" r="11" fill="#331a1d"/>
    <circle cx="324" cy="600" r="11" fill="#331a1d"/>
    <circle cx="396" cy="600" r="11" fill="#331a1d"/>
  </svg>`);

export const garments: Garment[] = [
  {
    id: "linen-shirt",
    name: "Linen Utility Shirt",
    brand: "TwinFit Atelier",
    category: "tops",
    fit: "Regular",
    fabric: "Linen blend",
    color: "Warm ivory",
    src: makeTee(),
    accent: "#b9aa98",
    conversionLift: 14,
    returnReduction: 9,
  },
  {
    id: "metro-blazer",
    name: "Metro Tailored Blazer",
    brand: "Northline",
    category: "outerwear",
    fit: "Structured",
    fabric: "Wool twill",
    color: "Ink navy",
    src: makeBlazer(),
    accent: "#253048",
    conversionLift: 19,
    returnReduction: 12,
  },
  {
    id: "aurora-dress",
    name: "Aurora Midi Dress",
    brand: "Vera Lab",
    category: "dresses",
    fit: "Fluid",
    fabric: "Satin weave",
    color: "Deep emerald",
    src: makeDress(),
    accent: "#13815f",
    conversionLift: 21,
    returnReduction: 15,
  },
  {
    id: "cloud-hoodie",
    name: "Cloudline Hoodie",
    brand: "Everyday AR",
    category: "tops",
    fit: "Relaxed",
    fabric: "Fleece",
    color: "Mist blue",
    src: makeHoodie(),
    accent: "#78aaba",
    conversionLift: 11,
    returnReduction: 7,
  },
  {
    id: "terra-trench",
    name: "Terra Long Trench",
    brand: "City Loom",
    category: "outerwear",
    fit: "Oversized",
    fabric: "Cotton gabardine",
    color: "Brick clay",
    src: makeTrench(),
    accent: "#90494b",
    conversionLift: 17,
    returnReduction: 13,
  },
];
