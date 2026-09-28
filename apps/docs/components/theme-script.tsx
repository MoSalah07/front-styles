/**
 * Runs before paint: restores theme, brand and density from localStorage so the
 * first frame is already correct (no flash of the wrong theme).
 *
 * It deliberately does not touch `lang` or `dir` any more. The language is part
 * of the URL now, so the server already rendered the document with the right
 * pair; a stored preference overwriting them here would contradict the page
 * that was actually served and break hydration on the first frame.
 */
const script = `(function(){try{
var d=document.documentElement,ls=localStorage;
var t=ls.getItem("design-eg:theme")||"dark";
var dark=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);
d.classList.toggle("dark",dark);d.classList.toggle("light",!dark);
d.style.colorScheme=dark?"dark":"light";d.dataset.themeChoice=t;
var b=ls.getItem("design-eg:brand");if(b)d.dataset.brand=b;
var den=ls.getItem("design-eg:density");if(den)d.dataset.density=den;
}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
