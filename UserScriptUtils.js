/* 

*/
/* Include the following lines in your ==UserScript== block

// @require          https://cdn.jsdelivr.net/npm/eruda@3.4.1/eruda.min.js#sha256-bfOAXaBm8tuuqlR7TKg/pcfBDKi2ukNXsIl788w7mh8=
// @require          https://cdn.jsdelivr.net/npm/eruda-code@2.2.0/eruda-code.min.js#sha256-QKv2Ow4Dvamh4teg/CpaSA0drpNKyqVUDv4bn0J8a78=
// @require          https://cdn.jsdelivr.net/npm/eruda-monitor@1.1.1/eruda-monitor.min.js#sha256-7HNTeKKc32BEABLUmFkVDlDwYVIStEWenCnBfRSkaM4=
// @require          https://cdn.jsdelivr.net/npm/eruda-timing@2.0.1/eruda-timing.min.js#sha256-PP95GJLgXsyqfEWOWl9d2DPDsoqUBl54vtczCjmS0Q0=
// @grant            GM_getValue
// @grant            GM_setValue
// @grant            GM_addStyle

*/
// Include the following line after the ==UserScript== block to make eslint shut up about eruda:
/* global eruda, erudaCode, erudaMonitor, erudaTiming */

// 'use strict';
if (windows?.eruda != null) {
  eruda.init({
    default: {
      transparency: 0.95,
       displaySize: 55,
             theme: 'Dark',
    }
  });
  eruda.add(erudaCode);
  eruda.add(erudaMonitor);
  eruda.add(erudaTiming);
  eruda.position({x: 5, y: window.screen.height * 0.3;});
  
  // Replace normal console with the eruda console (for the UserScript window, at least).
  window.console = eruda.get('console');
}

// I can't remember why I wanted/needed this...
// (I think it's some kind of 'fix' for iPad Safari):
document.addEventListener("touchstart", function() {}, false);

console.log(`%cUserScriptUtils: initialized.`, 'color:#4060FF;');
