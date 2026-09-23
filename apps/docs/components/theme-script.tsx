/**
 * Runs before paint: restores theme, brand, direction and density from localStorage
 * so the first frame is already correct (no flash of the wrong theme).
 */
const script = `(function(){try{
var d=document.documentElement,ls=localStorage;
var t=ls.getItem("design-eg:theme")||"dark";
var dark=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);
d.classList.toggle("dark",dark);d.classList.toggle("light",!dark);
d.style.colorScheme=dark?"dark":"light";d.dataset.themeChoice=t;
var b=ls.getItem("design-eg:brand");if(b)d.dataset.brand=b;
var dir=ls.getItem("design-eg:dir");if(dir){d.dir=dir;d.lang=dir==="rtl"?"ar":"en";}
var den=ls.getItem("design-eg:density");if(den)d.dataset.density=den;
}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
