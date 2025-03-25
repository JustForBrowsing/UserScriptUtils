/** 
  * @module UserScriptUtils
  */

/* Include the following lines in your ==UserScript== block
  // @require     https://raw.githubusercontent.com/JustForBrowsing/UserScriptUtils/refs/heads/main/UserScriptUtils.js
  // @require     https://cdn.jsdelivr.net/npm/eruda@3.4.1/eruda.min.js#sha256-bfOAXaBm8tuuqlR7TKg/pcfBDKi2ukNXsIl788w7mh8=
  // @require     https://cdn.jsdelivr.net/npm/eruda-code@2.2.0/eruda-code.min.js#sha256-QKv2Ow4Dvamh4teg/CpaSA0drpNKyqVUDv4bn0J8a78=
  // @require     https://cdn.jsdelivr.net/npm/eruda-monitor@1.1.1/eruda-monitor.min.js#sha256-7HNTeKKc32BEABLUmFkVDlDwYVIStEWenCnBfRSkaM4=
  // @require     https://cdn.jsdelivr.net/npm/eruda-timing@2.0.1/eruda-timing.min.js#sha256-PP95GJLgXsyqfEWOWl9d2DPDsoqUBl54vtczCjmS0Q0=
  // @grant       GM_getValue
  // @grant       GM_setValue
  // @grant       GM_addStyle
*/

// Include the following line after the ==UserScript== block to make eslint shut up about eruda:
/* -nop-global eruda, erudaCode, erudaMonitor, erudaTiming */

/* -nop-global _, CssSelectorGenerator, Enum */
/* -nop-global eruda, erudaFeatures */
/* -nop-global DazProductSlab, daz */

// @require     https://cdn.jsdelivr.net/npm/eruda@3.4.1/eruda.min.js#sha256-bfOAXaBm8tuuqlR7TKg/pcfBDKi2ukNXsIl788w7mh8=
// @require     https://cdn.jsdelivr.net/npm/eruda-code@2.2.0/eruda-code.min.js#sha256-QKv2Ow4Dvamh4teg/CpaSA0drpNKyqVUDv4bn0J8a78=
// @require     https://cdn.jsdelivr.net/npm/eruda-monitor@1.1.1/eruda-monitor.min.js#sha256-7HNTeKKc32BEABLUmFkVDlDwYVIStEWenCnBfRSkaM4=
// @require     https://cdn.jsdelivr.net/npm/eruda-timing@2.0.1/eruda-timing.min.js#sha256-PP95GJLgXsyqfEWOWl9d2DPDsoqUBl54vtczCjmS0Q0=


//let testVar = "nope";
// console.log("Starting UserScriptUtils:" + testVar);
//(function () {
//    let testVar = "ran';
//})();

function Test() {
    let testVar = "Test";
    console.log("UserScriptUtils:Test " + testVar);
}


/*
const RestoreWindowsConsole = (appId) => {
    try {
        const ogWindow = document.createElement('iframe');
        ogWindow.style.display = 'none';
        document.body.appendChild(ogWindow);
        if (window.console !== ogWindow?.contentWindow?.console &&
            ogWindow?.contentWindow?.console != null) {
            console.warn(`${appId}:RestoreWindowsConsole: found an altered console:'...', repairing!`);
            window.console = ogWindow.contentWindow.console;
            // NOTE: leave the iframe 'open' because it 'owns' the new console

        } else {
            // If we aren't loading it, then delete the unused iframe
            ogWindow.parentNode.removeChild(ogWindow);
        }
    } catch(err) {
        console.error(`${appId}:RestoreWindowsConsole: error while fixing altered console:`, err);
    }
}
//fixConsole(appId);
//console.log(`${appId}:console check complete.`);
const defaultPosition = { 
    x: 5,
    y: window.screen.height / 3,
};
const AddEruda = ( appId, options = {} ) => {
    // options = _.defaults(options, {
    let options = {
          fixConsole: true,
         displaySize: 55,
        transparency: 0.95,
            position: defaultPosition,
    };

    try {
        if (options?.fixConsole ?? true) {
             RestoreWindowsConsole(appId);
        }
     
    } catch (err) {
        const errMsg = `${appId}:AddEruda:Fixing Console: err: ${typeof err}: '${err.message}'.`;
        console.error(errMsg);
        alert(errMsg);
    }

    try {
        if (window.M3ERUDAINIT != null) {
            console.log(`${appId}:AddEruda: Eruda Already Running, Jumping To (Re)Configuring Eruda`);
            return;
        
        } else {
            window.M3ERUDAINIT = 'creating';
            console.log(`${appId}:AddEruda: Starting eruda console...`);
            eruda.init({
                   autoScale: true,
                useShadowDom: true,
                        tool: ['console', 'elements', 'info', 'sources',
                               'resources', 'network', 'settings'],
                    defaults: {
                        displaySize: options?.displaySize ?? 55,
                       transparency: options?.transparency ?? 0.95,
                    },
                    console: {
                        catchGlobalErr: true,
                           asyncRender: true,
                    },
            });
            window.M3ERUDAINIT = 'created';
         
     } catch (err) {
        const errMsg = `${appId}:AddEruda:Creating Eruda: err: ${typeof err}: '${err.message}'.`;
        console.error(errMsg);
        alert(errMsg);
    }
 
    try {
        window.M3ERUDAINIT = 'configuring';
        eruda.position(options?.position ?? defaultPosition); // Set the button position

        const eConsole = eruda.get('console');
        eConsole.config.set('catchGlobalErr', true);
        eConsole.config.set('asyncRender',    true);
        eConsole.config.set('transparency',   options?.transparency ?? 0.95);
        eConsole.config.set('displaySize',    options?.displaySize ?? 55);

        window.M3ERUDAINIT = 'changingToErudaConsole';
        windows.console = eConsole;
     
        window.M3ERUDAINIT = 'running';
     
    } catch (err) {
        const errMsg = `${appId}:AddEruda:Configuring Eruda: err: ${typeof err}: '${err.message}'.`;
        console.error(errMsg);
        alert(errMsg);
     
    } finally {
        console.log(`${appId}:AddEruda: ...Complete.`);
    }
}
// erudaInit(appId);
/*
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
eruda.position({ x: 5, 
                 y: window.screen.height / 3 });
eruda.get().config.set('displaySize', 55);

// Replace normal console with the eruda console (for the UserScript window, at least).
const erudaConsole = eruda.get('console');
if (erudaConsole) {
    window.console = erudaConsole
}
*/
// I can't remember why I wanted/needed this...
// (I think it's some kind of 'fix' for iPad Safari):
/*
document.addEventListener("touchstart", function() {}, false);

console.log(`%cUserScriptUtils: initialized.`, 'color:#4060FF;');

exports = {
    RestoreWindowsConsole: RestoreWindowsConsole,
                 AddEruda: AddEruda,
};


*/














