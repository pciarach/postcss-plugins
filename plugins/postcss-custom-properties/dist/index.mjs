import e from"postcss-value-parser";import{parse as t,addLayerToModel as r}from"@csstools/cascade-layer-name-parser";const n=t("csstools-implicit-layer")[0];function collectCascadeLayerOrder(e){const o=new Map,s=new Map,a=[];e.walkAtRules((e=>{if("layer"!==e.name.toLowerCase())return;{let t=e.parent;for(;t;){if("atrule"!==t.type||"layer"!==t.name.toLowerCase()){if(t===e.root())break;return}t=t.parent}}let i;if(e.nodes)i=normalizeLayerName(e.params,1);else{if(!e.params.trim())return;i=e.params}let l=t(i);if(l?.length){{let t=e.parent;for(;t&&"atrule"===t.type&&"layer"===t.name.toLowerCase();){const e=s.get(t);e?(l=l.map((t=>e.concat(t))),t=t.parent):t=t.parent}}if(r(a,l),e.nodes){const t=l[0].concat(n);o.set(e,t),s.set(e,l[0])}}}));for(const e of o.values())r(a,[e]);const i=new WeakMap;for(const[e,t]of o)i.set(e,a.findIndex((e=>t.equal(e))));return i}function normalizeLayerName(e,t){return e.trim()?e:"csstools-anon-layer--"+t++}const o=/(!\s*)?postcss-custom-properties:\s*off\b/i,s=new WeakMap;function isBlockIgnored(e){if(!e||!e.nodes)return!1;if(s.has(e))return s.get(e);const t=e.some((e=>isIgnoreComment(e,o)));return s.set(e,t),t}const a=/(!\s*)?postcss-custom-properties:\s*ignore\s+next\b/i;function isDeclarationIgnored(e){return!!e&&(!!isBlockIgnored(e.parent)||isIgnoreComment(e.prev(),a))}function isIgnoreComment(e,t){return!!e&&"comment"===e.type&&t.test(e.text)}const i=new Set(["layer"]);function isProcessableRule(e){let t=e.parent;for(;t;){if("atrule"===t.type&&!i.has(t.name.toLowerCase()))return!1;t=t.parent}return!0}const l=/^html$/i,c=/^:where\(html\)$/i,u=/^:root$/i,p=/^:where\(:root\)$/i,f=/(html|:root)/i,d=/^var$/i;function isVarFunction(e){return"function"===e.type&&d.test(e.value)&&Object(e.nodes).length>0}const w=/var\(/i;function removeCyclicReferences(e,t){const r=new Set;let n=t;for(;e.size>0;)try{toposort(Array.from(e.keys()),n);break}catch(t){if(!t._graphNode)throw t;e.delete(t._graphNode),r.add(t._graphNode),n=n.filter((e=>-1===e.indexOf(t._graphNode)))}return r}function toposort(e,t){let r=e.length;const n=new Array(r),o={};let s=r;const a=makeOutgoingEdges(t),i=makeNodesHash(e);for(;s--;)o[s]||visit(e[s],s,new Set);return n;function visit(e,t,s){if(s.has(e)){const t=new Error("Cyclic dependency"+JSON.stringify(e));throw t._graphNode=e,t}if(!i.has(e))return;if(o[t])return;o[t]=!0;let l=a.get(e)||new Set;if(l=Array.from(l),t=l.length){s.add(e);do{const e=l[--t];visit(e,i.get(e),s)}while(t);s.delete(e)}n[--r]=e}}function makeOutgoingEdges(e){const t=new Map;for(let r=0,n=e.length;r<n;r++){const n=e[r];t.has(n[0])||t.set(n[0],new Set),t.has(n[1])||t.set(n[1],new Set),t.get(n[0]).add(n[1])}return t}function makeNodesHash(e){const t=new Map;for(let r=0,n=e.length;r<n;r++)t.set(e[r],r);return t}function parseOrCached(t,r){let n=r.get(t);return n||(n=e(t),r.set(t,n),n)}function getCustomPropertiesFromRoot(t,r){const n=new Map,o=new Map,s=collectCascadeLayerOrder(t);t.walkRules((e=>{f.test(e.selector)&&e.nodes?.length&&isProcessableRule(e)&&(isBlockIgnored(e)||e.selectors.forEach((t=>{let r=-1;if(c.test(t)||p.test(t))r=0;else if(l.test(t))r=1;else{if(!u.test(t))return;r=2}const a=(f=s,((i=e).parent&&"atrule"===i.parent.type&&"layer"===i.parent.name.toLowerCase()?f.has(i.parent)?f.get(i.parent)+1:0:1e7)+10+r);var i,f;e.each((e=>{if("decl"!==e.type)return;if(!e.variable||isDeclarationIgnored(e))return;if("initial"===e.value.toLowerCase().trim())return;const t=o.get(e.prop)??-1;a>=t&&(o.set(e.prop,a),n.set(e.prop,e.value))}))})))}));const a=[],i=new Map;for(const[t,o]of n.entries()){const n=parseOrCached(o,r);e.walk(n.nodes,(e=>{if(isVarFunction(e)){const[r]=e.nodes.filter((e=>"word"===e.type));a.push([r.value,t])}})),i.set(t,n)}return removeCyclicReferences(i,a),i}function transformValueAST(t,r,n){if(!t.nodes?.length)return"";const o=new Map;return t.nodes.forEach((e=>{o.set(e,t)})),e.walk(t.nodes,(e=>{"nodes"in e&&e.nodes.length&&e.nodes.forEach((t=>{o.set(t,e)}))})),e.walk(t.nodes,(t=>{if(!isVarFunction(t))return;const[s,...a]=t.nodes.filter((e=>"div"!==e.type)),{value:i}=s,l=o.get(t);if(!l)return;const c=l.nodes.indexOf(t);if(-1===c)return;let u=!1;a&&e.walk(a,(e=>{if(isVarFunction(e)){const[t]=e.nodes.filter((e=>"word"===e.type));if(r.has(t.value)||n.has(t.value))return;return u=!0,!1}}));let p=n.get(i)?.nodes??r.get(i)?.nodes;p||!a.length||u||(p=t.nodes.slice(t.nodes.indexOf(a[0]))),void 0!==p&&(p.length?(l.nodes.splice(c,1,...p),l.nodes.forEach((e=>o.set(e,l)))):(l.nodes.splice(c,1,{type:"comment",value:"",sourceIndex:t.sourceIndex,sourceEndIndex:t.sourceEndIndex}),l.nodes.forEach((e=>o.set(e,l)))))}),!0),e.stringify(t.nodes)}function transformProperties(t,r,n,o,s){if(isTransformableDecl(t)&&!isDeclarationIgnored(t)){const o=t.value;let a=transformValueAST(e(o),r,n);const i=new Set;for(;w.test(a)&&!i.has(a);){i.add(a);a=transformValueAST(e(a),r,n)}if(a!==o){if(parentHasExactFallback(t,a))return void(s.preserve||t.remove());if(s.preserve){const e=t.cloneBefore({value:a});hasTrailingComment(e)&&e.raws?.value&&(e.raws.value.value=e.value.replace(m,"$1"),e.raws.value.raw=e.raws.value.value+e.raws.value.raw.replace(m,"$2"))}else t.value=a,hasTrailingComment(t)&&t.raws?.value&&(t.raws.value.value=t.value.replace(m,"$1"),t.raws.value.raw=t.raws.value.value+t.raws.value.raw.replace(m,"$2"))}}}const isTransformableDecl=e=>!e.variable&&e.value.includes("--")&&e.value.toLowerCase().includes("var("),hasTrailingComment=e=>"value"in Object(Object(e.raws).value)&&"raw"in(e.raws?.value??{})&&m.test(e.raws.value?.raw??""),m=/^([\W\w]+)(\s*\/\*[\W\w]+?\*\/)$/;function parentHasExactFallback(e,t){if(!e||!e.parent)return!1;let r=!1;const n=e.parent.index(e);return e.parent.each(((o,s)=>o!==e&&(!(s>=n)&&void("decl"===o.type&&o.prop.toLowerCase()===e.prop.toLowerCase()&&o.value===t&&(r=!0))))),r}function hasSupportsAtRuleAncestor(e){let t=e.parent;for(;t;)if("atrule"===t.type){if("supports"===t.name.toLowerCase()&&/([^\w]var\()|(\(top: var\(--f\))/i.test(t.params))return!0;t=t.parent}else t=t.parent;return!1}const v=/^initial$/i,creator=e=>{const t=!("preserve"in Object(e))||Boolean(e?.preserve);if("importFrom"in Object(e))throw new Error('[postcss-custom-properties] "importFrom" is no longer supported');if("exportTo"in Object(e))throw new Error('[postcss-custom-properties] "exportTo" is no longer supported');return{postcssPlugin:"postcss-custom-properties",prepare:()=>{let e=new Map;const r=new Map;return{Once:t=>{e=getCustomPropertiesFromRoot(t,r)},Declaration:n=>{if(!w.test(n.value))return;if(hasSupportsAtRuleAncestor(n))return;const o=new Map;t&&n.parent&&n.parent.each((e=>{"decl"===e.type&&e.variable&&n!==e&&(isDeclarationIgnored(e)||(v.test(e.value)?o.delete(e.prop):o.set(e.prop,parseOrCached(e.value,r))))})),transformProperties(n,e,o,0,{preserve:t})}}}}};creator.postcss=!0;export{creator as default};
