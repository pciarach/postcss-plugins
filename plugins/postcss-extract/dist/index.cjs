"use strict";var e,t=require("postcss-selector-parser");function notPseudo(e,t){return e.filter((e=>!t.includes(e)))}function adjacentSiblingCombinator(e){return e.map((e=>e.prev())).filter((e=>!!e))}function childCombinator(e){return e.map((e=>e.parent)).filter((e=>!!e))}function descendantCombinator(e){return e.flatMap((t=>{const n=[];let r=t.parent;for(;r;)n.push(r),r=r.parent;return e.length?n:[]})).filter((e=>!!e))}function generalSiblingCombinator(e){return e.flatMap((t=>{const n=[];let r=t.prev();for(;r;)n.push(r),r=r.prev();return e.length?n:[]})).filter((e=>!!e))}function matchAttribute(t,n,r,a,s=!1){if(n.startsWith("__proto__")||r?.startsWith("__proto__"))return[];let i=!1;r||""===r||(i=!0);let o="";i||(o=r.toString()),s&&(o=o.toLowerCase());return t.filter((t=>{let r="";if(r="variable"===n.toLowerCase()&&"decl"===t.type&&"variable"in t?"variable":Object.keys(t).find((e=>e.toLowerCase()===n.toLowerCase()&&Object.prototype.hasOwnProperty.call(t,e))),!r)return!1;if("boolean"==typeof t[r])return t[r];if(i)return!0;let u=[t[r].toString()];switch("rule"!==t.type||"selector"!==r&&"selectors"!==r||(u=t.selectors),s&&(u=u.map((e=>e.toLowerCase()))),a){case e.StartsWith:return!!u.find((e=>e.startsWith(o)));case e.EndsWith:return!!u.find((e=>e.endsWith(o)));case e.Contains:return!!u.find((e=>e.includes(o)));case e.Exact:default:return!!u.find((e=>e===o))}}))}function matchTagName(e,t){return e.filter((e=>e.type.toLowerCase()===t.toLowerCase()))}function simplifyASTNode(e){switch(e.type){case"decl":{const t=e;return cleanUndefinedValues({type:t.type,important:t.important,prop:t.prop,value:t.value,variable:t.variable})}case"rule":{const t=e;return cleanUndefinedValues({type:t.type,selectors:t.selectors})}case"atrule":{const t=e;return cleanUndefinedValues({type:t.type,name:t.name,params:t.params})}case"comment":{const t=e;return cleanUndefinedValues({type:t.type,text:t.text})}default:return{}}}function cleanUndefinedValues(e){return Object.keys(e).forEach((t=>{void 0===e[t]&&delete e[t]})),e}function extract(e,t){const n={};for(const[r,a]of t){let t=new Set;a.each((n=>{t=selectNodesForSingleQuery(e,n,t)})),n[r]=[];for(const e of t)n[r].push(simplifyASTNode(e))}return n}function selectNodesForSingleQuery(e,t,n){const r=buildQuery(t);if(!r)return new Set;const a=new Set(n);return e.walk((e=>{if(a.has(e))return;executeConditions(r,[e]).length>0&&a.add(e)})),a}function buildQuery(t){if(!t||!t.nodes)return;let n;return t.each((t=>{switch(t.type){case"universal":n={next:n,run:e=>e};break;case"combinator":switch(t.value){case" ":n={next:n,run:e=>descendantCombinator(e)};break;case">":n={next:n,run:e=>childCombinator(e)};break;case"+":n={next:n,run:e=>adjacentSiblingCombinator(e)};break;case"~":n={next:n,run:e=>generalSiblingCombinator(e)};break;default:n={next:n,run:()=>[]}}break;case"tag":n={next:n,run:e=>matchTagName(e,t.value)};break;case"pseudo":if(":not"===t.value)n={next:n,run:e=>{const n=t.nodes.map((e=>buildQuery(e))),r=e.filter((e=>n.flatMap((t=>t?executeConditions(t,[e]):[])).length>0));return notPseudo(e,r)}};else n={next:n,run:()=>[]};break;case"attribute":switch(t.operator){case"^=":n={next:n,run:n=>matchAttribute(n,t.attribute,t.value,e.StartsWith,t.insensitive)};break;case"$=":n={next:n,run:n=>matchAttribute(n,t.attribute,t.value,e.EndsWith,t.insensitive)};break;case"*=":n={next:n,run:n=>matchAttribute(n,t.attribute,t.value,e.Contains,t.insensitive)};break;default:n={next:n,run:n=>matchAttribute(n,t.attribute,t.value,e.Exact,t.insensitive)}}break;default:n={next:n,run:()=>[]}}})),n}function executeConditions(e,t){let n=e,r=t;for(;n&&r.length>0;)r=n.run(r),n=n.next;return r}!function(e){e.Exact="",e.StartsWith="^",e.EndsWith="$",e.Contains="*"}(e||(e={}));const creator=e=>{const n=Object(e),r=new Map;return Object.keys(n.queries??{}).forEach((e=>{r.set(e,t().astSync(n.queries[e]))})),n.results||(n.results=e=>{console.log(e)}),{postcssPlugin:"postcss-extract",prepare:()=>n.extractLate?{OnceExit:e=>{n.results(extract(e,r))}}:{Once:e=>{n.results(extract(e,r))}}}};creator.postcss=!0,module.exports=creator;
