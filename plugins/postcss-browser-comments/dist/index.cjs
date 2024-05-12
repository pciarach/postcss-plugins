"use strict";var e=require("browserslist");const creator=s=>({postcssPlugin:"postcss-browser-comments",prepare(t){console.log("result",t.root?.source?.input.file);const r=new Set(e(Object(s).browsers||null,{path:t.root?.source?.input.file}));return{postcssPlugin:"postcss-browser-comments",Once(s){const t=s.nodes.slice(0);for(const s of t){if(!isBrowserCommentNode(s))continue;const t=s.next();if(!t||"rule"!==t.type)continue;const o=getBrowserData(s.text);o.isNumbered?(t.nodes.filter(isBrowserReferenceCommentNode).map((s=>{const t=parseFloat(s.text)-1,n=e(o.browserslist[t]);browserslistsOverlap(r,n)||(s.prev()?.remove(),s.remove())})),t.nodes.length||(t.remove(),s.remove())):browserslistsOverlap(r,e(o.browserslist))||(t.remove(),s.remove())}}}}});function isBrowserCommentNode(e){return"comment"===e.type&&(!!s.test(e.text)&&"rule"===e.next()?.type)}creator.postcss=!0;const s=/^\*\n * /;function isBrowserReferenceCommentNode(e){return"comment"===e.type&&t.test(e.text)}const t=/^\d+$/;function getBrowserData(e){const s=e.match(r);return s?{browserslist:s.map((e=>getBrowsersList(e.replace(n,"$1")))),isNumbered:!0}:{browserslist:getBrowsersList(e.replace(o,"")),isNumbered:!1}}const r=/(\n \* \d+\. (?:[^\n]+|\n \* {4,})+)/g,o=/^\*\n \* ?|\n \*/g,n=/\n \* (?:( )\s*)?/g;function getBrowsersList(e){return e.split(c).slice(1).map((e=>e.split(i).filter((e=>e)))).reduce(((e,s)=>e.concat(s)),[]).map((e=>e.replace(l,((e,s,t)=>"all"===s?"> 0%":`${s}${t?/^((?:\d*\.)?\d+)-$/.test(t)?` <= ${t.slice(0,-1)}`:` ${t}`:" > 0"}`)).toLowerCase()))}const c=/\s+in\s+/,i=/(?: and|, and|,)/,l=/^\s*(\w+)(?: ((?:(?:\d*\.)?\d+-)?(?:\d*\.)?\d+[+-]?))?.*$/;function browserslistsOverlap(e,s){return s.some((s=>e.has(s)))}module.exports=creator;
