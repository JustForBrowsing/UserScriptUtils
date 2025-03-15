/* module UserScriptUtils
     desc A set of utility functions for UserScripts
*/
/* Include the following lines in the ==UserScript== block:

// @require          https://cdn.jsdelivr.net/npm/eruda@3.4.1/eruda.min.js#sha256-bfOAXaBm8tuuqlR7TKg/pcfBDKi2ukNXsIl788w7mh8=
// @require          https://cdn.jsdelivr.net/npm/eruda-code@2.2.0/eruda-code.min.js#sha256-QKv2Ow4Dvamh4teg/CpaSA0drpNKyqVUDv4bn0J8a78=
// @require          https://cdn.jsdelivr.net/npm/eruda-monitor@1.1.1/eruda-monitor.min.js#sha256-7HNTeKKc32BEABLUmFkVDlDwYVIStEWenCnBfRSkaM4=
// @require          https://cdn.jsdelivr.net/npm/eruda-timing@2.0.1/eruda-timing.min.js#sha256-PP95GJLgXsyqfEWOWl9d2DPDsoqUBl54vtczCjmS0Q0=
// @grant            GM_getValue
// @grant            GM_setValue
// @grant            GM_addStyle
*/

// Include the following comment line after the ==UserScript== block to make 
//     eslint shut up about eruda when using it directly as just 'eruda' 
//     instead of 'window.eruda'.
/* global eruda, erudaCode, erudaMonitor, erudaTiming, UserScriptUtils */

/* UserScriptUtils Start ---------------------------------------------------- */
import eruda from https://cdn.jsdelivr.net/npm/eruda@3.4.1/eruda.min.js;

const IsSafari = navigator.vendor && 
                 navigator.vendor.indexOf('Apple') > -1 &&
                 navigator.userAgent &&
                 navigator.userAgent.indexOf('CriOS') == -1 &&
                 navigator.userAgent.indexOf('FxiOS') == -1;

const IncludesIC = (strArray, strToFind) => {
    return (strArray) => {
        return strArray.localeCompare(strToFind, 'core');
    };
};

const restoreOriginalConsole(replaceWindowsConsole = null) => {
    replaceWindowsConsole ??= false;

    // Restore original window.console (fixes sites that override console).
    const tempConsoleIFrame = document.createElement('iframe');
    tempConsoleIFrame.style.display = 'none';
    document.body.appendChild(tempConsoleIFrame);
    // if (window.console !== tempConsoleIFrame.contentWindow.console) {
    //     alert('console mismatch');
    // }
    const originalConsole = tempConsoleIFrame.contentWindow.console;
    if (replaceWindowsConsole === true) {
        window.console = originalConsole;
    }
    return originalConsole;
}

class ErudaInfo {
    get run()       { return this.url  || this.ref; }
    get load()      { return this.show || this.url != null; }
    get isBuiltin() { return this.builtin; }
    get isPlugin()  { return !this.builtin; }
    constructor(parms) {
        this.id       = parms?.id.toLowerCase() ?? parms?.name.toLowerCase();
        this.name     = parms?.name             ?? this.id;
        this.url      = parms?.url              ?? null;
        this.import   = parms?.import           ?? null;
        this.ref      = parms?.ref              ?? null;
        this.builtin  = parms?.builtin          ?? false;
        this.show     = !!parms?.show           ?? false;
    }
}

const erudaModuleInfo = [
    ErudaInfo({ id: "console",      name: "Console",    show: true,  builtin: true, }),
    ErudaInfo({ id: "elements",     name: "Elements",   show: true,  builtin: true, }),
    ErudaInfo({ id: "resources",    name: "Resources",  show: true,  builtin: true, }),
    ErudaInfo({ id: "sources",      name: "Sources",    show: true,  builtin: true, }),
    ErudaInfo({ id: "info",         name: "Info",       show: true,  builtin: true, }),
    ErudaInfo({ id: "snippets",     name: "Snippets",   show: true,  builtin: true, }),
    ErudaInfo({ id: "monitor",      name: "Monitor",    show: true,  import: "erudaMonitor",
                url: "https://cdn.jsdelivr.net/npm/eruda-monitor@1.1.1/eruda-monitor.min.js", }),
    //  ErudaInfo({   id: "selector",     name: "Selector",   show: true,      ref: new Selector()  }),
    ErudaInfo({ id: "code",         name: "Code",       show: true,  import: "erudaCode",
                url: "https://cdn.jsdelivr.net/npm/eruda-code@2.2.0/eruda-code.min.js", }),
    ErudaInfo({ id: "timing",       name: "Timing",     show: true,  import: "erudaTimer",
                url: "https://cdn.jsdelivr.net/npm/eruda-timing@2.0.1/eruda-timing.min.js", }),
    ErudaInfo({ id: "settings",     name: "Settings",   show: true,  builtin: true, }),
    ErudaInfo({ id: "default",                          show: true, }),
    ErudaInfo({ id: "touches",      name: "Touches",    show: false, url: null }),
    ErudaInfo({ id: "features",     name: "Features",   show: false, url: null }),
    ErudaInfo({ id: "pixel",        name: "Pixel",      show: false, url: null }),
    ErudaInfo({ id: "memory",       name: "Memory",     show: false, url: null }),
];
//  show: console, elements, resources, sources, info, 
//        snippets, monitor*, select??, code*, timing*, settings
//     *: code, monitor, timing, touches*, 
//        features, pixel, memory
//     x: dom,

const defaultEnableErudaOptions = {
    // eruda passthrough options:
                 tools: ['console', 'elements', 'code', 'snippets', 'resources',
                         'monitor', 'timing',   'info', 'sources',  'settings'],
              position: {          // screen position of eruda 'open' button
                            x: 5, 
                            y: (window?.screen?.height ?? 600) * 0.30,
                        },         // defaults to left edge at 1/3 of screen height
    // eruda.default passthrough options:
          transparency: 0.95,      // transparency of eruda when open (and of button??)
           displaySize: 55,        // percent of window height that eruda should use when open 
                 theme: 'Dark',    // eruda theme to use. Note: 'Light' is another default theme
    
    // enableErudaOptions
          checkPageUrl: false,     // If true, only load eruda if page url includes eruda=true
    suppressTouchStart: true,      // see notes below
       overrideConsole: true,      // if true, eruda's console replaces the exist console
               console: undefined, // alternate 'console' to replace with eruda's console,
                                   // pass null to suppress the replacement of the console.
                                   // defaults to 'window.console'.
                 eruda: null,      // use options.eruda to pass any other options directly 
                                   // to eruda.init(), leave this undefined (or null), to 
                                   // to use the default options, and set this to {} 
                                   // (empty braces) to intentionally set no options.
      //    useShadowDom: true,      // see eruda docs
      //       autoScale: true,      // see eruda docs
};


const enableEruda = (options = null, ) => { 
    // Don't run if checkPageUrl == true and 'eruda=true' switch not in URL -OR-
    //           if eruda is already running
    if ((options.checkPageUrl && !/eruda=true/.test(window.location)) && 
        localStorage.getItem('active-eruda') != 'true') {
        return;     
    }

    // Wait until page is partly loaded before proceeding
    //     "loading"      -- first state
    //     "interactive"  -- just before DOMContentLoaded
    //     "complete"     -- after/near load event
    if (document.readyState !== "complete") {
        // Loading hasn't finished yet
        window.addEventListener("load", (evt) => enableErudaLoadHandler(options));
    } else {
        // `DOMContentLoaded` has already fired
        enableErudaLoadHandler(options);
    }
}

const enableErudaPageLoadHandler  = (options = null) => {
    options ??= defaultEnableErudaOptions;
    
    options.eruda                      ??= options.eruda ?? {};
    options.eruda.default              ??= options.eruda.default ?? {};
    options.eruda.default.transparency ??= options.transparency;
    options.eruda.default.position     ??= options.position;
    options.eruda.default.displaySize  ??= options.displaySize; 
    options.eruda.default.theme        ??= options.theme;
    options.eruda
    const toolList ??= options?.tools;
    
    if (import.meta.env.MODE !== undefined &&
        import.meta.env.MODE !== 'development') { // check for enviroment setting
        return;
        // import('eruda').then(eruda => eruda.default.init());
    }

    // keep copies of the original browser's and page's console(s) object
    let browserConsole;
    if (overrideConsole === true) {
        browserConsole = restoreOriginalConsole(false); // gets browser's OG console
        window.eruda.browserConsole = browserConsole; // save cooy of browser's console
        window.eruda.pageConsole    = window.console; // save copy of current page's console
    }
    
    const eruda = window.eruda;
    if (eruda != null) {
        // needed so that eruda links to options.console, if provided
        if (options?.console != null) {
            window.console = options?.console ?? window.console;
        }
        // initialize eruda
        eruda.init(options.eruda);

        if (overrideConsole === true) {
            // get eruda's console and switch system 
            const erudaConsole = eruda.get('console');
            erudaConsole.log(`import.meta.env.MODE: ${import.meta.env.MODE}`);
    
            // set the window console to use eruda's console output
            window.console = erudaConsole;
        }
        
        const console = window.console;
        for (const ei of erudaModuleInfo) {  // cycle through each module
            if (ei.builtin === true && ei.show === true) {        // just show builtins
                eruda.show(ei.id);
                continue;
                
            } else if (!IncludesIC(toolList, ei.id) ||
                       ei.builtin === true && ei.show === false) {
                // skip builtins that arent't shown
                eruda.hide(ei.id);
                continue;
            }

            // import the module, if needed
            let pluginRef = null;
            if (ei.run === true) {
                if (ei.import != null && window[ei.import] != null) {
                    pluginRef = ei.import; // already loaded
                    
                } else if (ei.plugin != null) {
                    pluginRef = ei.plugin; // loading object reference 
                    
                } else if (ei.url != null) {
                    pluginRef = import(ei.url);
                    
                } else {
                    throw new Error("error: eruda bad url, id:", ei.id);
                }
                if (pluginRef != null) {
                    eruda.add(pluginRef);
                }
            }
        }
        
        // hide all modules the show modules with show = true.
        for (const ei of erudaModuleInfo) {
            eruda.hide(ei.id);
            if (ei.show === true) {
                eruda.show(ei.id);
            } else {
                eruda.hide(ei.id);
            }
        }

        // re-set eruda options after initialization
        if (options?.scale) {
            eruda.scale(options.scale);
        }
        if (options?.position) {
            eruda.position(options.position);
        }
    
        const cfg = eruda.get().config;
        if (options?.displaySize) {
            cfg.set('displaySize', options.displaySize);
        }
        if (options?.transparency) {
            cfg.set('transparency', options.transparency);
        }
        if (options?.theme) {
            cfg.set('theme', options.theme);
        }
        // eruda.position({ x: 5, y: window.screen.height * 0.3 });
        // eruda.get().config.set('displaySize', 55);
        
    } else if (eruda == null) {
        throw Error(`enableEruda:enableErudaPageLoadHandler: Error: window.eruda was null.`);
        
    } else if (options?.console != null) {
        window.console = options?.console;
    }
    
    // Reguarding 'click' events on Safari iOS:
    // NOTE: as of 2025-03-14, I am unable to confirm if this issue still exists.
    //   Exerpt from 'Notes on handling clicks and taps on iOS devices and touch enabled mobile browsers' 
    //     at https://aamnah.com/notes/javascript/events-clicks-taps-mobile-browsers-ios/
    //       by Aamnah, posted 2017-11-12:
    //   iOS Safari will only trigger click events for elements that
    //     * are deemed clickable (a link or an input. divs/spans are not considered clickable)
    //     * have the CSS cursor property set to pointer
    //     * have an onclick attribute (can be empty, doesn’t matter)
    if (options.fixTouchClickStart !== true) {
        if (isSafari) {
          // NOTE: I'm not sure if this is still needed with recent Safari iOS versions:
          //   eruda.js includes the following comment and code:
          //       // http://stackoverflow.com/questions/3885018/active-pseudo-class-doesnt-work-in-mobile-safari
          //       if (detectBrowser().name === 'ios') el.setAttribute('ontouchstart', '')
          document.addEventListener("ontouchstart", function() {}, false);
          //OG: document.addEventListener("touchstart", function() {}, false);
        }
    }
    
    console.log(`%cUserScriptUtils: initialized.`, 'color:#4060FF;');
};
export {
    enableEruda                 as enableEruda,
    IncludesIC                  as IncludesIC,
    window.eruda.browserConsole as browserConsole,
    window.eruda.pageConsole    as pageConsole,
};











