/* ***** BEGIN LICENSE BLOCK *****
 *   Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 * 
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Menu Icons Plus.
 *
 * The Initial Developer of the Original Code is
 * Justin Rodes.
 * Portions created by the Initial Developer are Copyright (C) 2008
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 * 
 * ***** END LICENSE BLOCK ***** */

var menuIconsPlus = {
  onLoad: function() {
    // initialization code
    this.debug = true;
    this.prefs = Components.classes['@mozilla.org/preferences-service;1']
                           .getService(Components.interfaces.nsIPrefService)
                           .getBranch('extensions.menuiconsplus.');
    // load bindings
    this.loadStyleSheet('chrome://menuiconsplus/skin/bindings.css');
    // non-Windows OS
    var nonWindows = (navigator.platform.indexOf('Win') == -1);
    if (nonWindows)
      this.loadStyleSheet('chrome://menuiconsplus/skin/non_windows.css');

    /* load rest of stylesheets depending on user prefs */
    // menu icon set
    this.loadStyleSheet(this.prefs.getCharPref('icongridstylesheet'));
    // external icons
    if (this.prefs.getCharPref('icongridstylesheet') || this.prefs.getBoolPref('usethememenuicons'))
      this.loadStyleSheet('chrome://menuiconsplus/skin/external_icons.css');
    // checkmark and radio button style
    switch (this.prefs.getIntPref('checkmarkstyle')) {
      case 0:
        this.loadStyleSheet('chrome://menuiconsplus/skin/os_checkmarks_radiobuttons.css');
        break;
      case 1:
        this.loadStyleSheet('chrome://menuiconsplus/skin/alt_checkmarks_radiobuttons.css');
        break;
      case 2:
        this.loadStyleSheet('chrome://menuiconsplus/skin/iconset_checkmarks_radiobuttons.css');
        break;
      default:
    }
    // use theme icons
    if (this.prefs.getBoolPref('usethememenuicons') && !nonWindows) {
      this.loadStyleSheet('chrome://menuiconsplus/skin/browser_theme_icons.css');
      // use icons from classic theme restorer if available
      var key = document.getElementById('ctraddon_key_toggleCtrAddonBar');
      if (key)
        this.loadStyleSheet('chrome://menuiconsplus/skin/ctr_icons.css');
    }
    // disabled menuitem icons
    if (this.prefs.getBoolPref('hidedisabledmenuicons'))
      this.loadStyleSheet('chrome://menuiconsplus/skin/hide_disabled.css');
    else
      this.loadStyleSheet('chrome://menuiconsplus/skin/default_disabled.css');

    // take care of 'image' attributes
    if (this.prefs.getCharPref('icongridstylesheet')) {
      // webdeveloper
      this.removeAttrib([document.getElementById('web-developer-menu'),
                         document.getElementById('web-developer-context')], 'image');
      var menu = document.getElementById('web-developer-menu');
      if (menu) {
        this.loadStyleSheet('chrome://menuiconsplus/skin/webdeveloper.css');
        var submenus = menu.getElementsByTagName('menu');
        this.removeAttrib(submenus, 'image');
      }
      menu = document.getElementById('web-developer-context');
      if (menu) {
        submenus = menu.getElementsByTagName('menu');
        this.removeAttrib(submenus, 'image');
      }
      // gspace
      var panel = document.getElementById('gspace-panel');
      if (panel) {
        var buttons = panel.getElementsByTagName('toolbarbutton');
        this.removeAttrib(buttons, 'image');
      }
      // mystickies
      this.removeAttrib([document.getElementById('context-mystickies-addNote')], 'image');
      this.removeAttrib([document.getElementById('menu-mystickies-addNote')], 'image');
      var toolbar = document.getElementById('toolbar-mystickies');
      if (toolbar) {
        var buttons = toolbar.getElementsByTagName('toolbarbutton');
        this.removeAttrib(buttons, 'image');
      }
      // similarweb
      var popup = document.getElementById('menuStatusbarOptions');
      if (popup) {
        var mitems = popup.getElementsByTagName('menuitem');
        this.removeAttrib(mitems, 'image');
      }
      var btn = document.getElementById('similarweb-options-button');
      if (btn) {
        var mitems = btn.firstChild.childNodes;
        this.removeAttrib(mitems, 'image');
      }
      // tamper data icon redux
      this.removeAttrib([document.getElementById('appmenu-webDeveloper-tdiconmenu')], 'image');
      this.removeAttrib([document.getElementById('menu_webDeveloper_tdiconmenu')], 'image');
    }
    this.initialized = true;
  },
  loadStyleSheet: function(aChromeURI) {
    // check param
    if (typeof aChromeURI != 'string' || (aChromeURI.slice(0, 9) != 'chrome://' &&
                                          aChromeURI.slice(0, 8) != 'file:///')) // restricted to local URI's, just to be safe
      return false;
    // set up stylesheet service
    var sss = Components.classes['@mozilla.org/content/style-sheet-service;1']
                        .getService(Components.interfaces.nsIStyleSheetService);
    var ios = Components.classes['@mozilla.org/network/io-service;1']
                        .getService(Components.interfaces.nsIIOService);
    try {
      var uri = ios.newURI(aChromeURI, null, null);
      if (!sss.sheetRegistered(uri, sss.AGENT_SHEET))
        sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
    } catch(e) {
        Components.utils.reportError(e); // report the error
        return false;
    }
    return true;
  },
  removeAttrib: function(aElementArray, aAttribute) {
    for (var i = 0, j = aElementArray.length; i < j; i++) {
      if (!aElementArray[i]) // if the element doesn't exist, skip it
        continue;
      if (aElementArray[i].hasAttribute(aAttribute))
        aElementArray[i].removeAttribute(aAttribute);
    }
  },
  miniMapFix: function() {
    var btn = document.getElementById('addAddressPanel'),
        bClass = btn.className;
    if (btn.getAttribute('image') == 'chrome://minimap/skin/accept.png') {
      btn.className += ' checked';
      btn.setAttribute('image', '');
    }
    else if (!btn.hasAttribute('image')) {
      if (bClass.indexOf(' checked') != -1)
        btn.className = bClass.replace(' checked', '');
    }
  },
  webDevFix: function(aSuffix) {
    var mitem = document.getElementById('web-developer-dom-inspector-' + aSuffix);
    if (mitem && !mitem.className)
      mitem.className = 'menuitem-iconic';
  },
  log: function(msg) {
    if (this.debug) {
      window.dump('MenuIconsPlus: ' + msg + '\n');
    }
  }
};
window.addEventListener('load', function(e) { menuIconsPlus.onLoad(e); }, false);
