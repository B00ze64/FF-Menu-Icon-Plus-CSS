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

// this overlay is for 'uncooperative' add-ons
var menuIconSecondary = {
  onLoad: function() {
    var iconSet = Components.classes['@mozilla.org/preferences-service;1']
                            .getService(Components.interfaces.nsIPrefService)
                            .getBranch('extensions.menuiconsplus.')
                            .getCharPref('icongridstylesheet');
    if(!iconSet)
      return;
    switch(document.location.toString()) {
      case 'chrome://dta/content/dta/select.xul':
        this.removeAttrib([document.getElementById('selectall'),
                           document.getElementById('selectfiltered'),
                           document.getElementById('invertSelection'),
                           document.getElementById('mopen')], 'image');
        break;
      case 'chrome://dta/content/dta/manager.xul':
        this.removeAttrib([document.getElementById('info'),
                           document.getElementById('launch'),
                           document.getElementById('delete'),
                           document.getElementById('folder'),
                           document.getElementById('play'),
                           document.getElementById('pause'),
                           document.getElementById('cancel'),
                           document.getElementById('removeCompleted'),
                           document.getElementById('selectall'),
                           document.getElementById('selectinv'),
                           document.getElementById('movetop'),
                           document.getElementById('moveup'),
                           document.getElementById('movedown'),
                           document.getElementById('movebottom'),
                           document.getElementById('misc'),
                           document.getElementById('addchunk'),
                           document.getElementById('removechunk'),
                           document.getElementById('force'),
                           document.getElementById('remove'),
                           document.getElementById('prefs')], 'image');
        break;
      case 'chrome://gspace/content/gspaceWindow.xul':
        var win = document.getElementById('gspace-window');
        if (win) {
          var buttons = win.getElementsByTagName('toolbarbutton');
          this.removeAttrib(buttons, 'image');
        }
        break;
      case 'chrome://scrapbook/content/scrapbook.xul':
      case 'chrome://scrapbook/content/manage.xul':
        this.removeAttrib([document.getElementById('sbSearchImage')], 'src');
        break;
      case 'chrome://scrapbook/content/trade.xul':
        var popup = document.getElementById('sbTradeTreePopup');
        if (popup) {
          var mItems = popup.getElementsByTagName('menuitem');
          this.removeAttrib(mItems, 'src');
        }
        break;
      case 'chrome://mozimage/content/mozimage.xul':
        var page = document.getElementById('mozimage-window');
        if (page) {
          var buttons = page.getElementsByTagName('toolbarbutton');
          this.removeAttrib(buttons, 'image');
          var mItems = page.getElementsByTagName('menuitem');
          this.removeAttrib(mItems, 'image');
        }
        break;
      case 'chrome://smxtra5/content/smxtra.xul':
        if (iconSet != 'chrome://menuiconsplus/skin/Silk.css') {
          var buttons = document.getElementsByTagName('toolbarbutton');
          this.removeAttrib(buttons, 'image');
        }
        break;
      case 'chrome://imacros/content/edit.xul':
        if (iconSet == 'chrome://menuiconsplus/skin/Crystal Project.css')
          this.loadStyleSheet('chrome://menuiconsplus/skin/imacros-crystal_project.css');
        else if (iconSet == 'chrome://menuiconsplus/skin/Silk.css')
          this.loadStyleSheet('chrome://menuiconsplus/skin/imacros-silk.css');
        else if (iconSet == 'chrome://menuiconsplus/skin/Tango.css')
          this.loadStyleSheet('chrome://menuiconsplus/skin/imacros-tango.css');
        break;
      case 'chrome://imacros/content/share.xul':
        var dialog = document.getElementById('share_window');
        if (dialog){
          var images = dialog.getElementsByTagName('image');
          images[0].removeAttribute('src');
          images[0].className = 'copyButtonImage';
          images[1].removeAttribute('src');
          images[1].className = 'emailButtonImage';
        }
        break;
      case 'chrome://minimap/content/minimap.xul':
      case 'chrome://minimap/content/maptab.xul':
        var btn = document.getElementById('myoptions');
        if (btn) {
          var mitems = btn.getElementsByTagName('menuitem');
          this.removeAttrib(mitems, 'image');
          var menus =  btn.getElementsByTagName('menu');
          this.removeAttrib(menus, 'image');
        }
        break;
      case 'chrome://tvmanager/content/sidebar/tvmanager.xul':
        var tb = document.getElementById('toolbar-main');
        if (tb) {
          var buttons = tb.getElementsByTagName('toolbarbutton');
          if (buttons[1].getAttribute('image') == 'chrome://tvmanager/skin/images/search.png')
            buttons[1].removeAttribute('image');
        }
        break;
      case 'chrome://similarweb/content/similarweb.xul':
        var popup = document.getElementById('siteContextMenu');
        if (popup) {
          var mItems = popup.getElementsByTagName('menuitem');
          this.removeAttrib(mItems, 'image');
        }
        var popup = document.getElementById('articleContextMenu');
        if (popup) {
          var mItems = popup.getElementsByTagName('menuitem');
          this.removeAttrib(mItems, 'image');
        }
        break;
      case 'chrome://gmanager/content/options/options.xul':
        var lb = document.getElementById('gmanager-options-listbox');
        if (lb && iconSet != 'chrome://menuiconsplus/skin/Silk.css') {
          var lItems = lb.getElementsByTagName('listitem');
          this.removeAttrib(lItems, 'image');
        }
        break;
      case 'chrome://googlebuttons/content/googlebuttonsSettings.xul':
        var popup = document.getElementById('leftTreeMenu');
        if (popup) {
          var mItems = popup.getElementsByTagName('menuitem');
          this.removeAttrib(mItems, 'image');
        }
        var popup = document.getElementById('rightTreeMenu');
        if (popup) {
          var mItems = popup.getElementsByTagName('menuitem');
          this.removeAttrib(mItems, 'image');
          this.removeAttrib([mItems[0]], 'style');
        }
        break;
      default:
    }
  },
  removeAttrib: function(aElementArray, aAttribute) {
    for (var i = 0, j = aElementArray.length; i < j; i++) {
      if (!aElementArray[i]) // if the element doesn't exist, skip it
        continue;
      if (aElementArray[i].hasAttribute(aAttribute))
        aElementArray[i].removeAttribute(aAttribute);
    }
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
      if (!sss.sheetRegistered(uri, sss.USER_SHEET))
        sss.loadAndRegisterSheet(uri, sss.USER_SHEET);
    } catch(e) {
        Components.utils.reportError(e); // report the error
        return false;
    }
    return true;
  }
};

window.addEventListener('load', function(e) { menuIconSecondary.onLoad(e); }, false);
