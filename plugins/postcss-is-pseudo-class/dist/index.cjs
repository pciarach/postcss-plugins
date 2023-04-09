"use strict";var e=require("postcss-selector-parser"),o=require("@csstools/selector-specificity");function alwaysValidSelector(o){const s=e().astSync(o);let t=!0;return s.walk((e=>{var o,s;if("class"!==e.type&&"comment"!==e.type&&"id"!==e.type&&"root"!==e.type&&"selector"!==e.type&&"string"!==e.type&&"tag"!==e.type&&"universal"!==e.type&&("attribute"!==e.type||e.insensitive)&&("combinator"!==e.type||"+"!==e.value&&">"!==e.value&&"~"!==e.value&&" "!==e.value)&&("pseudo"!==e.type||null!=(o=e.nodes)&&o.length||":hover"!==e.value.toLowerCase()&&":focus"!==e.value.toLowerCase())){if("pseudo"===e.type&&1===(null==(s=e.nodes)?void 0:s.length)&&":not"===e.value.toLowerCase()){let o=!0;if(e.nodes[0].walkCombinators((()=>{o=!1})),o)return}return t=!1,!1}})),t}function sortCompoundSelectorsInsideComplexSelector(o){if(!o||!o.nodes||1===o.nodes.length)return;const s=[];let t=[];for(let n=0;n<o.nodes.length;n++)"combinator"!==o.nodes[n].type?e.isPseudoElement(o.nodes[n])?(s.push(t),t=[o.nodes[n]]):t.push(o.nodes[n]):(s.push(t),s.push([o.nodes[n]]),t=[]);s.push(t);const n=[];for(let e=0;e<s.length;e++){const o=s[e];o.sort(((e,o)=>"selector"===e.type&&"selector"===o.type&&e.nodes.length&&o.nodes.length?selectorTypeOrder(e.nodes[0],e.nodes[0].type)-selectorTypeOrder(o.nodes[0],o.nodes[0].type):"selector"===e.type&&e.nodes.length?selectorTypeOrder(e.nodes[0],e.nodes[0].type)-selectorTypeOrder(o,o.type):"selector"===o.type&&o.nodes.length?selectorTypeOrder(e,e.type)-selectorTypeOrder(o.nodes[0],o.nodes[0].type):selectorTypeOrder(e,e.type)-selectorTypeOrder(o,o.type)));for(let e=0;e<o.length;e++)n.push(o[e])}for(let s=n.length-1;s>=0;s--){const t=n[s-1];if(n[s].remove(),t&&"tag"===t.type&&"tag"===n[s].type){const t=e.pseudo({value:":is",nodes:[e.selector({value:"",nodes:[n[s]]})]});o.prepend(t)}else o.prepend(n[s])}}function selectorTypeOrder(o,t){return e.isPseudoElement(o)?s.pseudoElement:s[t]}const s={universal:0,tag:1,pseudoElement:2,id:3,class:4,attribute:5,pseudo:6,selector:7,string:8,root:9,comment:10};function childAdjacentChild(e){return!(!e||!e.nodes)&&("selector"===e.type&&(3===e.nodes.length&&(!(!e.nodes[0]||"pseudo"!==e.nodes[0].type||":-csstools-matches"!==e.nodes[0].value)&&(!(!e.nodes[1]||"combinator"!==e.nodes[1].type||"+"!==e.nodes[1].value&&"~"!==e.nodes[1].value)&&(!(!e.nodes[2]||"pseudo"!==e.nodes[2].type||":-csstools-matches"!==e.nodes[2].value)&&(!(!e.nodes[0].nodes||1!==e.nodes[0].nodes.length)&&("selector"===e.nodes[0].nodes[0].type&&(!(!e.nodes[0].nodes[0].nodes||3!==e.nodes[0].nodes[0].nodes.length)&&(!(!e.nodes[0].nodes[0].nodes||"combinator"!==e.nodes[0].nodes[0].nodes[1].type||">"!==e.nodes[0].nodes[0].nodes[1].value)&&(!(!e.nodes[2].nodes||1!==e.nodes[2].nodes.length)&&("selector"===e.nodes[2].nodes[0].type&&(!(!e.nodes[2].nodes[0].nodes||3!==e.nodes[2].nodes[0].nodes.length)&&(!(!e.nodes[2].nodes[0].nodes||"combinator"!==e.nodes[2].nodes[0].nodes[1].type||">"!==e.nodes[2].nodes[0].nodes[1].value)&&(e.nodes[0].nodes[0].insertAfter(e.nodes[0].nodes[0].nodes[0],e.nodes[2].nodes[0].nodes[0].clone()),e.nodes[2].nodes[0].nodes[1].remove(),e.nodes[2].nodes[0].nodes[0].remove(),e.nodes[0].replaceWith(e.nodes[0].nodes[0]),e.nodes[2].replaceWith(e.nodes[2].nodes[0]),!0))))))))))))))}function isInCompoundWithOneOtherElement(o){if(!o||!o.nodes)return!1;if("selector"!==o.type)return!1;if(2!==o.nodes.length)return!1;let s,t;return o.nodes[0]&&"pseudo"===o.nodes[0].type&&":-csstools-matches"===o.nodes[0].value?(s=0,t=1):o.nodes[1]&&"pseudo"===o.nodes[1].type&&":-csstools-matches"===o.nodes[1].value&&(s=1,t=0),!!s&&(!!o.nodes[t]&&(("selector"!==o.nodes[t].type||!o.nodes[t].some((o=>"combinator"===o.type||e.isPseudoElement(o))))&&(o.nodes[s].append(o.nodes[t].clone()),o.nodes[s].replaceWith(...o.nodes[s].nodes),o.nodes[t].remove(),!0)))}function isPseudoInFirstCompound(e){if(!e||!e.nodes)return!1;if("selector"!==e.type)return!1;let o=-1;for(let s=0;s<e.nodes.length;s++){const t=e.nodes[s];if("combinator"===t.type)return!1;if("pseudo"===t.type&&":-csstools-matches"===t.value){if(!t.nodes||1!==t.nodes.length)return!1;o=s;break}}if(-1===o)return!1;const s=e.nodes.slice(0,o),t=e.nodes[o],n=e.nodes.slice(o+1);return s.forEach((e=>{t.nodes[0].append(e.clone())})),n.forEach((e=>{t.nodes[0].append(e.clone())})),t.replaceWith(...t.nodes),s.forEach((e=>{e.remove()})),n.forEach((e=>{e.remove()})),!0}function complexSelectors(o,s,t,n){return o.flatMap((o=>{if(-1===o.indexOf(":-csstools-matches")&&-1===o.toLowerCase().indexOf(":is"))return o;const r=e().astSync(o);return r.walkPseudos((o=>{if(":is"===o.value.toLowerCase()&&o.nodes&&o.nodes.length&&"selector"===o.nodes[0].type&&0===o.nodes[0].nodes.length)return o.value=":not",void o.nodes[0].append(e.universal());if(":-csstools-matches"===o.value)if(!o.nodes||o.nodes.length){if(o.walkPseudos((o=>{if(e.isPseudoElement(o)){let e=o.value;if(e.startsWith("::-csstools-invalid-"))return;for(;e.startsWith(":");)e=e.slice(1);o.value=`::-csstools-invalid-${e}`,n()}})),1===o.nodes.length&&"selector"===o.nodes[0].type){if(1===o.nodes[0].nodes.length)return void o.replaceWith(o.nodes[0].nodes[0]);if(!o.nodes[0].some((e=>"combinator"===e.type)))return void o.replaceWith(...o.nodes[0].nodes)}1!==r.nodes.length||"selector"!==r.nodes[0].type||1!==r.nodes[0].nodes.length||r.nodes[0].nodes[0]!==o?childAdjacentChild(o.parent)||isInCompoundWithOneOtherElement(o.parent)||isPseudoInFirstCompound(o.parent)||("warning"===s.onComplexSelector&&t(),o.value=":is"):o.replaceWith(...o.nodes[0].nodes)}else o.remove()})),r.walk((e=>{"selector"===e.type&&"nodes"in e&&1===e.nodes.length&&"selector"===e.nodes[0].type&&e.replaceWith(e.nodes[0])})),r.walk((e=>{"nodes"in e&&sortCompoundSelectorsInsideComplexSelector(e)})),r.toString()})).filter((e=>!!e))}function splitSelectors(s,t,n=0){const r=":not(#"+t.specificityMatchingName+")",d=":not(."+t.specificityMatchingName+")",l=":not("+t.specificityMatchingName+")";return s.flatMap((s=>{if(-1===s.toLowerCase().indexOf(":is"))return s;let c=!1;const i=[];if(e().astSync(s).walkPseudos((e=>{var s,t,n,a,p;if(":is"!==e.value.toLowerCase()||!e.nodes||!e.nodes.length)return;if("selector"===e.nodes[0].type&&0===e.nodes[0].nodes.length)return;if("pseudo"===(null==(s=e.parent)||null==(t=s.parent)?void 0:t.type)&&":not"===(null==(n=e.parent)||null==(a=n.parent)||null==(p=a.value)?void 0:p.toLowerCase()))return void i.push([{start:e.parent.parent.sourceIndex,end:e.parent.parent.sourceIndex+e.parent.parent.toString().length,option:`:not(${e.nodes.toString()})`}]);let u=e.parent;for(;u;){if(u.value&&":is"===u.value.toLowerCase()&&"pseudo"===u.type)return void(c=!0);u=u.parent}const h=o.selectorSpecificity(e),f=e.sourceIndex,y=f+e.toString().length,m=[];e.nodes.forEach((e=>{const s={start:f,end:y,option:""},t=o.selectorSpecificity(e);let n=e.toString().trim();const c=Math.max(0,h.a-t.a),i=Math.max(0,h.b-t.b),a=Math.max(0,h.c-t.c);for(let e=0;e<c;e++)n+=r;for(let e=0;e<i;e++)n+=d;for(let e=0;e<a;e++)n+=l;s.option=n,m.push(s)})),i.push(m)})),!i.length)return[s];let a=[];return cartesianProduct(...i).forEach((e=>{let o="";for(let n=0;n<e.length;n++){var t;const r=e[n];o+=s.substring((null==(t=e[n-1])?void 0:t.end)||0,e[n].start),o+=":-csstools-matches("+r.option+")",n===e.length-1&&(o+=s.substring(e[n].end))}a.push(o)})),c&&n<10&&(a=splitSelectors(a,t,n+1)),a})).filter((e=>!!e))}function cartesianProduct(...e){const o=[],s=e.length-1;return function helper(t,n){for(let r=0,d=e[n].length;r<d;r++){const d=t.slice(0);d.push(e[n][r]),n===s?o.push(d):helper(d,n+1)}}([],0),o}const creator=e=>{const o={specificityMatchingName:"does-not-exist",...e||{}};return{postcssPlugin:"postcss-is-pseudo-class",prepare(){const e=new WeakSet;return{Rule(s,{result:t}){if(!s.selector)return;if(-1===s.selector.toLowerCase().indexOf(":is("))return;if(e.has(s))return;let n=!1;const warnOnComplexSelector=()=>{"warning"===o.onComplexSelector&&(n||(n=!0,s.warn(t,`Complex selectors in '${s.selector}' can not be transformed to an equivalent selector without ':is()'.`)))};let r=!1;const warnOnPseudoElements=()=>{"warning"===o.onPseudoElement&&(r||(r=!0,s.warn(t,`Pseudo elements are not allowed in ':is()', unable to transform '${s.selector}'`)))};try{let t=!1;const n=[],r=complexSelectors(splitSelectors(s.selectors,{specificityMatchingName:o.specificityMatchingName}),{onComplexSelector:o.onComplexSelector},warnOnComplexSelector,warnOnPseudoElements);if(Array.from(new Set(r)).forEach((o=>{if(s.selectors.indexOf(o)>-1)n.push(o);else{if(alwaysValidSelector(o))return n.push(o),void(t=!0);e.add(s),s.cloneBefore({selector:o}),t=!0}})),n.length&&t&&(e.add(s),s.cloneBefore({selectors:n})),!o.preserve){if(!t)return;s.remove()}}catch(e){if(e.message.indexOf("call stack size exceeded")>-1)throw e;s.warn(t,`Failed to parse selector "${s.selector}"`)}}}}}};creator.postcss=!0,module.exports=creator;
