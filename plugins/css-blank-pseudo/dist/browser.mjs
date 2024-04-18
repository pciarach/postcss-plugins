var e=[" ",">","~",":","+","@","#","(",")"];function isValidReplacement(t){for(var n=!0,r=0,o=e.length;r<o&&n;r++)t.indexOf(e[r])>-1&&(n=!1);return n}var t="js-blank-pseudo";function isFormControlElement(e){return"INPUT"===e.nodeName||"SELECT"===e.nodeName||"TEXTAREA"===e.nodeName}function createNewEvent(e){var t;return"function"==typeof Event?t=new Event(e,{bubbles:!0}):(t=document.createEvent("Event")).initEvent(e,!0,!1),t}function observeValueOfHTMLElement(e,t){var n=Object.getOwnPropertyDescriptor(e.prototype,"value"),r=n.set;n.set=function set(){r.apply(this,arguments),t({target:this})},Object.defineProperty(e.prototype,"value",n)}function cssBlankPseudoInit(e){var n={force:!1,replaceWith:"[blank]"};if(void 0!==e&&"force"in e&&(n.force=e.force),void 0!==e&&"replaceWith"in e&&(n.replaceWith=e.replaceWith),!isValidReplacement(n.replaceWith))throw new Error(n.replaceWith+" is not a valid replacement since it can't be applied to single elements.");try{if(document.querySelector(":blank"),!n.force)return}catch(m){}var r,o,a,i,l,c,d,s=("."===(r=n.replaceWith)[0]?(o=r.slice(1),a=function remove(e){return e.classList.remove(o)},i=function add(e){return e.classList.add(o)}):(o=r.slice(1,-1),a=function remove(e){return e.removeAttribute(o,"")},i=function add(e){return e.setAttribute(o,"")}),function handleInputOrChangeEvent(e){var t,n=e.target;isFormControlElement(n)&&(("SELECT"===n.nodeName?null!=(t=n.options[n.selectedIndex])&&t.value:n.value)?a(n):i(n))}),u=function bindEvents(){document.body&&(document.body.addEventListener("change",s),document.body.addEventListener("input",s))},f=function updateAllCandidates(){Array.prototype.forEach.call(document.querySelectorAll("input, select, textarea"),(function(e){s({target:e})}))};if(document.body?u():window.addEventListener("load",u),-1===document.documentElement.className.indexOf(t)&&(document.documentElement.className+=" "+t),observeValueOfHTMLElement(self.HTMLInputElement,s),observeValueOfHTMLElement(self.HTMLSelectElement,s),observeValueOfHTMLElement(self.HTMLTextAreaElement,s),l=self.HTMLOptionElement,c=Object.getOwnPropertyDescriptor(l.prototype,"selected"),d=c.set,c.set=function set(e){d.apply(this,arguments);var t=createNewEvent("change");this.parentElement.dispatchEvent(t)},Object.defineProperty(l.prototype,"selected",c),f(),"undefined"!=typeof self.MutationObserver)new MutationObserver((function(e){e.forEach((function(e){Array.prototype.forEach.call(e.addedNodes||[],(function(e){1===e.nodeType&&isFormControlElement(e)&&s({target:e})}))}))})).observe(document,{childList:!0,subtree:!0});else{var p=function handleOnLoad(){return f()};window.addEventListener("load",p),window.addEventListener("DOMContentLoaded",p)}}export{cssBlankPseudoInit as default};
//# sourceMappingURL=browser.mjs.map
