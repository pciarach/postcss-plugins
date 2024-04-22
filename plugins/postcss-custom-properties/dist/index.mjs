import{parse as e,addLayerToModel as t}from"@csstools/cascade-layer-name-parser";import r from"postcss-value-parser";import{hasSupportsAtRuleAncestor as n}from"@csstools/utilities";const o=e("csstools-implicit-layer")[0];function collectCascadeLayerOrder(r){const n=new Map,s=new Map,a=[];r.walkAtRules((r=>{if("layer"!==r.name.toLowerCase())return;{let e=r.parent;for(;e;){if("atrule"!==e.type||"layer"!==e.name.toLowerCase()){if(e===r.root())break;return}e=e.parent}}let i;if(r.nodes)i=normalizeLayerName(r.params,1);else{if(!r.params.trim())return;i=r.params}let l=e(i);if(l?.length){{let e=r.parent;for(;e&&"atrule"===e.type&&"layer"===e.name.toLowerCase();){const t=s.get(e);t?(l=l.map((e=>t.concat(e))),e=e.parent):e=e.parent}}if(t(a,l),r.nodes){const e=l[0].concat(o);n.set(r,e),s.set(r,l[0])}}}));for(const e of n.values())t(a,[e]);const i=new WeakMap;for(const[e,t]of n)i.set(e,a.findIndex((e=>t.equal(e))));return i}function normalizeLayerName(e,t){return e.trim()?e:"csstools-anon-layer--"+t++}const s=/(!\s*)?postcss-custom-properties:\s*off\b/i,a=new WeakMap;function isBlockIgnored(e){if(!e||!e.nodes)return!1;if(a.has(e))return a.get(e);const t=e.some((e=>isIgnoreComment(e,s)));return a.set(e,t),t}const i=/(!\s*)?postcss-custom-properties:\s*ignore\s+next\b/i;function isDeclarationIgnored(e){return!!e&&(!!isBlockIgnored(e.parent)||isIgnoreComment(e.prev(),i))}function isIgnoreComment(e,t){return!!e&&"comment"===e.type&&t.test(e.text)}const l=new Set(["layer"]);function isProcessableRule(e){let t=e.parent;for(;t;){if("atrule"===t.type&&!l.has(t.name.toLowerCase()))return!1;t=t.parent}return!0}const c=/^html$/i,u=/^:where\(html\)$/i,p=/^:root$/i,f=/^:where\(:root\)$/i,d=/(html|:root)/i,m=/^var$/i;function isVarFunction(e){return"function"===e.type&&m.test(e.value)&&Object(e.nodes).length>0}const v=/\bvar\(/i;function parseOrCached(e,t){let n=t.get(e);return n||(n=r(e),t.set(e,n),n)}function toposort(e,t){let r=e.length;const n=new Array(r),o={};let s=r;const a=makeOutgoingEdges(t),i=makeNodesHash(e);for(;s--;)o[s]||visit(e[s],s,new Set);return n;function visit(e,t,s){if(s.has(e)){let t;try{t=", node was:"+JSON.stringify(e)}catch(e){t=""}throw new Error("Cyclic dependency"+t)}if(!i.has(e))throw new Error("Found unknown node. Make sure to provided all involved nodes. Unknown node: "+JSON.stringify(e));if(o[t])return;o[t]=!0;const l=Array.from(a.get(e)||new Set);if(t=l.length){s.add(e);do{const e=l[--t];visit(e,i.get(e),s)}while(t);s.delete(e)}n[--r]=e}}function removeCyclicReferences(e,t){const r=new Set;for(;e.size>0;){const n=findCyclicNode(Array.from(e.keys()),t);if(!n)return r;e.delete(n),r.add(n),t=t.filter((e=>-1===e.indexOf(n)))}return r}function findCyclicNode(e,t){let r=e.length;const n=new Array(r),o={};let s=r;const a=makeOutgoingEdges(t),i=makeNodesHash(e);for(;s--;)if(!o[s]){const t=visit(e[s],s,new Set);if(!t)continue;return t}function visit(e,t,s){if(s.has(e))return e;if(!i.has(e))return;if(o[t])return;o[t]=!0;const l=Array.from(a.get(e)||new Set);if(t=l.length){s.add(e);do{const e=l[--t],r=visit(e,i.get(e),s);if(r)return r}while(t);s.delete(e)}n[--r]=e}}function makeOutgoingEdges(e){const t=new Map;for(let r=0,n=e.length;r<n;r++){const n=e[r];t.has(n[0])||t.set(n[0],new Set),t.has(n[1])||t.set(n[1],new Set),t.get(n[0]).add(n[1])}return t}function makeNodesHash(e){const t=new Map;for(let r=0,n=e.length;r<n;r++)t.set(e[r],r);return t}function parseVarFunction(e){let t,r,n=!1;for(const o of e.nodes)if(t||"word"!==o.type)if(!t||n||"div"!==o.type||","!==o.value){if(n&&Array.isArray(r))r.push(o);else if("space"!==o.type&&("div"!==o.type||""!==o.value.trim()))return}else n=!0,r=[];else t=o;if(t)return{name:t,fallback:r}}function transformValueAST(e,t){return e.nodes?.length?(walk(e.nodes,((e,n,o)=>{if(!isVarFunction(e))return;const s=parseVarFunction(e);if(!s)return;let a=!1;s.fallback&&r.walk(s.fallback,(e=>{if(!isVarFunction(e))return;const r=parseVarFunction(e);return r?r.fallback||t.has(r.name.value)?void 0:(a=!0,!1):void 0}));let i=t.get(s.name.value)?.nodes;i||!s.fallback||a||(i=s.fallback),void 0!==i&&(i.length?o.splice(n,1,...i):o.splice(n,1,{type:"div",value:" ",before:"",after:"",sourceIndex:e.sourceIndex,sourceEndIndex:e.sourceEndIndex}))})),r.stringify(e.nodes)):""}function walk(e,t){let r,n,o;for(r=0,n=e.length;r<n;r+=1)o=e[r],"function"===o.type&&Array.isArray(o.nodes)&&walk(o.nodes,t),t(o,r,e),n=e.length}const w=/^initial$/i;function isInitial(e){const t=e.nodes.filter((e=>"comment"!==e.type&&"space"!==e.type));return 1===t.length&&("word"===t[0].type&&w.test(t[0].value))}function buildCustomPropertiesMap(e,t,n){if(!e.size)return t;const o=new Map(t);{const s=[];for(const[a,i]of e.entries()){const l=parseOrCached(i,n);let c=!1;r.walk(l.nodes,(r=>{if(!isVarFunction(r))return;const n=parseVarFunction(r);n&&(n.fallback||e.has(n.name.value)||t.has(n.name.value)?s.push([n.name.value,a]):c=!0)})),c||o.set(a,l)}removeCyclicReferences(o,s)}{const e=[];for(const[t,n]of o.entries())r.walk(n.nodes,(r=>{if(!isVarFunction(r))return;const n=parseVarFunction(r);n&&(n.fallback||o.has(n.name.value)?e.push([n.name.value,t]):o.delete(t))}));for(let t=0;t<e.length;t++){const[r,n]=e[t];o.has(r)&&o.has(n)||e.splice(t--,1)}const t=toposort(Array.from(o.keys()),e);for(const e of t){const t=o.get(e);if(!t)continue;const r=parseOrCached(transformValueAST(t,o),n);o.set(e,r)}}for(const[e,t]of o.entries())isInitial(t)&&o.delete(e);return o}function getCustomPropertiesFromRoot(e,t){const r=new Map,n=new Map,o=collectCascadeLayerOrder(e);return e.walkRules((e=>{d.test(e.selector)&&e.nodes?.length&&isProcessableRule(e)&&(isBlockIgnored(e)||e.selectors.forEach((t=>{let s=-1;if(u.test(t)||f.test(t))s=0;else if(c.test(t))s=1;else{if(!p.test(t))return;s=2}const a=(l=o,((i=e).parent&&"atrule"===i.parent.type&&"layer"===i.parent.name.toLowerCase()?l.has(i.parent)?l.get(i.parent)+1:0:1e7)+10+s);var i,l;e.each((e=>{if("decl"!==e.type)return;if(!e.variable||isDeclarationIgnored(e))return;if("initial"===e.value.toLowerCase().trim())return;const t=n.get(e.prop)??-1;a>=t&&(n.set(e.prop,a),r.set(e.prop,e.value))}))})))})),buildCustomPropertiesMap(r,new Map,t)}function getCustomPropertiesFromSiblings(e,t,r){if(!e.parent)return t;const n=new Map;return e.parent.each((t=>{"decl"===t.type&&t.variable&&e!==t&&(isDeclarationIgnored(t)||n.set(t.prop,t.value))})),n.size?buildCustomPropertiesMap(n,t,r):t}function transformProperties(e,t,n){if(isTransformableDecl(e)&&!isDeclarationIgnored(e)){const o=e.value,s=transformValueAST(r(o),t);if(s===o)return;if(parentHasExactFallback(e,s))return void(n.preserve||e.remove());if(n.preserve){const t=e.cloneBefore({value:s});hasTrailingComment(t)&&t.raws?.value&&(t.raws.value.value=t.value.replace(g,"$1"),t.raws.value.raw=t.raws.value.value+t.raws.value.raw.replace(g,"$2"))}else e.value=s,hasTrailingComment(e)&&e.raws?.value&&(e.raws.value.value=e.value.replace(g,"$1"),e.raws.value.raw=e.raws.value.value+e.raws.value.raw.replace(g,"$2"))}}const isTransformableDecl=e=>!e.variable&&e.value.includes("--")&&e.value.toLowerCase().includes("var("),hasTrailingComment=e=>"value"in Object(Object(e.raws).value)&&"raw"in(e.raws?.value??{})&&g.test(e.raws.value?.raw??""),g=/^([\W\w]+)(\s*\/\*[\W\w]+?\*\/)$/;function parentHasExactFallback(e,t){if(!e||!e.parent)return!1;let r=!1;const n=e.parent.index(e);return e.parent.each(((o,s)=>o!==e&&(!(s>=n)&&void("decl"===o.type&&o.prop.toLowerCase()===e.prop.toLowerCase()&&o.value===t&&(r=!0))))),r}const h=/(?:\bvar\()|(?:\(top: var\(--f\))/i,creator=e=>{const t=!("preserve"in Object(e))||Boolean(e?.preserve);if("importFrom"in Object(e))throw new Error('[postcss-custom-properties] "importFrom" is no longer supported');if("exportTo"in Object(e))throw new Error('[postcss-custom-properties] "exportTo" is no longer supported');return{postcssPlugin:"postcss-custom-properties",prepare(){let e=new Map;const r=new WeakMap,o=new Map;return{postcssPlugin:"postcss-custom-properties",Once(t){e=getCustomPropertiesFromRoot(t,o)},Declaration(s){if(!v.test(s.value))return;if(n(s,h))return;let a=e;t&&s.parent&&(a=r.get(s.parent)??getCustomPropertiesFromSiblings(s,e,o),r.set(s.parent,a)),transformProperties(s,a,{preserve:t})}}}}};creator.postcss=!0;export{creator as default};
