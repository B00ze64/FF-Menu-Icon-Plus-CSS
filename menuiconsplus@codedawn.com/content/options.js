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

var menuIconOptions = {
  onLoad: function() {
    // initialization code
    this.strings = document.getElementById('menuiconsplus-strings');
    this.prefs = Components.classes['@mozilla.org/preferences-service;1']
                           .getService(Components.interfaces.nsIPrefService)
                           .getBranch('extensions.menuiconsplus.');
    this.prompts = Components.classes['@mozilla.org/embedcomp/prompt-service;1']
                             .getService(Components.interfaces.nsIPromptService);
    this.updateIconSetMenu();
    // load current prefs into an object (I use this instead of a pref observer)
    this.oldPrefVals = this.loadPrefValues();
    this.newPrefVals = null;
    var browserPrefs = Components.classes['@mozilla.org/preferences-service;1']
                                 .getService(Components.interfaces.nsIPrefService)
                                 .getBranch('browser.preferences.');
    if (browserPrefs.getBoolPref('instantApply')) {
      var prefWin = document.getElementById('menuiconsplus-preferences');
      prefWin.setAttribute('ondialogcancel', 'return menuIconOptions.accept();');
    }
    this.initialized = true;
  },
  accept: function() {
    var iconSetMenuVal = document.getElementById('iconset-menu').value,
        iconStyleSheet = '';
    if (iconSetMenuVal.length)
      iconStyleSheet = iconSetMenuVal.slice(0, iconSetMenuVal.length - 4) + '.css';
    this.prefs.setCharPref('icongridstylesheet', iconStyleSheet);
    // if no icon set is selected, use Firefox default checkmarks
    var iconSetCheckmarks = document.getElementById('iconset-checkmarks-radio');
    if (iconSetCheckmarks.disabled && iconSetCheckmarks.selected)
      this.prefs.setIntPref('checkmarkstyle', 0);
    // compare old pref values to new pref values in order to put the changes into effect without restart
    this.newPrefVals = this.loadPrefValues();
    var checkExternalIcons = false;
    for (var i = 0; i < this.newPrefVals.length; i++) {
      if (this.oldPrefVals[i].value != this.newPrefVals[i].value) {
        switch (this.newPrefVals[i].name) {
          case 'icongridstylesheet':
            checkExternalIcons = true;
            break;
          case 'usethememenuicons':
            checkExternalIcons = true;
            // if unchecking browser theme icons, also unload Classic Theme Restorer icons
            var ctrIconsRegistered = this.isSheetActive('chrome://menuiconsplus/skin/ctr_icons.css');
            if (ctrIconsRegistered && !this.newPrefVals[i].value)
              this.toggleStyleSheet('chrome://menuiconsplus/skin/ctr_icons.css');
            break;
          default:
        }
        this.toggleStyleSheet(this.oldPrefVals[i].value);
        this.toggleStyleSheet(this.newPrefVals[i].value);
      }
    }
    // (un)load the external icons, if necessary
    if (checkExternalIcons) {
      var externalIconsRegistered = this.isSheetActive('chrome://menuiconsplus/skin/external_icons.css');
      if (!this.prefs.getCharPref('icongridstylesheet') &&
          !this.prefs.getBoolPref('usethememenuicons') &&
          externalIconsRegistered) {
        this.toggleStyleSheet('chrome://menuiconsplus/skin/external_icons.css');
      }
      else if ((this.prefs.getCharPref('icongridstylesheet') || this.prefs.getBoolPref('usethememenuicons')) &&
               !externalIconsRegistered) {
        this.toggleStyleSheet('chrome://menuiconsplus/skin/external_icons.css');
      }
    }
    return true;
  },
  updatePreview: function(aImageURI) {
    document.getElementById('iconset-preview-image').style.backgroundImage = (aImageURI) ? 'url("' + aImageURI + '")' : 'none';
    document.getElementById('delete-menuitem').disabled = (aImageURI.length) ? (aImageURI.slice(0, 28) == 'chrome://menuiconsplus/skin/') : true;
    document.getElementById('export-menuitem').disabled = !aImageURI.length;
    document.getElementById('iconset-checkmarks-radio').disabled = !aImageURI.length;
  },
  doImportWizard: function() {
    var wizWin = window.open('import.xul','menuiconsplusimportwizard','chrome=yes,alwaysRaised=yes,centerscreen=yes,dialog=yes');
  },
  doExport: function(aIconSet) {
    Components.utils.import('resource://gre/modules/AddonManager.jsm');
    AddonManager.getAddonByID('menuiconsplus@codedawn.com', function(addon) {
      var addonDir = addon.getResourceURI('').QueryInterface(Components.interfaces.nsIFileURL).file,
          pngFile = addonDir.clone();
      pngFile.append('skin');
      // window.dump('MenuIconsPlus: ' + pngFile.path + '\n');
      if (['Crystal Project', 'Fugue', 'Oxygen', 'Silk', 'Tango'].indexOf(aIconSet) == -1)
        pngFile = menuIconOptions.getCustomDir();
      var cssFile = pngFile.clone();
      pngFile.append(aIconSet + '.png');
      cssFile.append(aIconSet + '.css');
      // get destination folder (chosen by user)
      var nsIFilePicker = Components.interfaces.nsIFilePicker;
      var fp = Components.classes['@mozilla.org/filepicker;1'].createInstance(nsIFilePicker);
      fp.init(window, menuIconOptions.strings.getString('filepickerSelectFolder'), nsIFilePicker.modeGetFolder);
      var result = fp.show();
      if (result != nsIFilePicker.returnOK)
        return;
      // before doing the copy, confirm if a file of that name already exists in the destination folder
      var dir = fp.file,
          pngFileTest = dir.clone(),
          cssFileTest = dir.clone();
      pngFileTest.append(aIconSet + '.png');
      cssFileTest.append(aIconSet + '.css');
      if (pngFileTest.exists() || cssFileTest.exists()) {
        var result = menuIconOptions.prompts.confirm(null, menuIconOptions.strings.getString('confirmFileReplaceTitle'), menuIconOptions.strings.getString('confirmFileReplaceMessage'));
        if (result) { // go ahead and overwrite it
          try {
            if (pngFileTest.exists())
              pngFileTest.remove(false);
            if (cssFileTest.exists())
              cssFileTest.remove(false);
          }
          catch (e) {
            Components.utils.reportError(e);
            if (e.name == 'NS_ERROR_FILE_ACCESS_DENIED')
              menuIconOptions.prompts.alert(null, menuIconOptions.strings.getString('errorTitle'), menuIconOptions.strings.getString('errorAccessDeniedMessage'));
            else
              menuIconOptions.prompts.alert(null, menuIconOptions.strings.getString('errorTitle'), menuIconOptions.strings.getString('errorCantOverwriteTargetMessage'));
            return;
          }
        }
        else // abort the mission
          return;
      }
      // peform the file copy
      try {
        pngFile.copyTo(dir, '');
        cssFile.copyTo(dir, '');
      }
      catch (e) {
        Components.utils.reportError(e);
        menuIconOptions.prompts.alert(null, menuIconOptions.strings.getString('errorTitle'), menuIconOptions.strings.getString('errorCantExportMessage'));
      }
    });
  },
  doDelete: function(aIconSet) {
    var pngFile = this.getCustomDir(),
        cssFile = pngFile.clone();
    pngFile.append(aIconSet + '.png');
    cssFile.append(aIconSet + '.css');
    var result = this.prompts.confirm(null, this.strings.getString('confirmDeleteTitle'), this.strings.getFormattedString('confirmDeleteMessage', [aIconSet]));
    if (result) {
      try {
        if (pngFile.exists())
          pngFile.remove(false);
        if (cssFile.exists())
          cssFile.remove(false);
      }
      catch (e) {
        Components.utils.reportError(e);
        this.prompts.alert(null, this.strings.getString('errorTitle'), this.strings.getString('errorCantDeleteMessage'));
        return;
      }
      // change pref if the selected icon set was deleted
      var iconSetMenu = document.getElementById('iconset-menu'),
          stylesheetURI = this.prefs.getCharPref('icongridstylesheet'),
          imageURI = stylesheetURI.slice(0, stylesheetURI.length - 4) + '.png';
      if (imageURI == iconSetMenu.value) {
        this.prefs.setCharPref('icongridstylesheet', 'chrome://menuiconsplus/skin/Fugue.css'); // this is the default
      }
      this.updateIconSetMenu();
    }
  },
  updateIconSetMenu: function() {
    var iconSetMenu = document.getElementById('iconset-menu');
    while (iconSetMenu.hasChildNodes()) { // clear menu if necessary
      iconSetMenu.removeChild(iconSetMenu.lastChild);
    }
    var iconSets = new Array({label: this.strings.getString('labelNone'), value: ''},
                             {label: 'Crystal Project', value: 'chrome://menuiconsplus/skin/Crystal Project.png'},
                             {label: 'Fugue', value: 'chrome://menuiconsplus/skin/Fugue.png'},
                             {label: 'Oxygen', value: 'chrome://menuiconsplus/skin/Oxygen.png'},
                             {label: 'Silk', value: 'chrome://menuiconsplus/skin/Silk.png'},
                             {label: 'Tango', value: 'chrome://menuiconsplus/skin/Tango.png'});
    var dir = this.getCustomDir(), // dir is the customicons folder, where user-made icon sets are stored
        path = 'file:///' + dir.path.replace(/\\/g, '\/').replace(/^\s*\/?/, '') + '/',
        entries = dir.directoryEntries, entry = null;
    while (entries.hasMoreElements() && (entry = entries.getNext()) != null) {
      entry.QueryInterface(Components.interfaces.nsIFile);
      var fileName = entry.leafName,
          iconSetName = fileName.slice(0, -4),
          fileExt = fileName.slice(fileName.length - 4, fileName.length).toLowerCase();
      if (entry.isFile() && fileExt == '.png')
        iconSets.push({label: iconSetName, value: path + fileName});
    }
    // sort the icon sets by label
    iconSets.sort(function(a, b) { if (a.label.toLowerCase() > b.label.toLowerCase()) return 1;
                                   if (a.label.toLowerCase() < b.label.toLowerCase()) return -1;
                                   return 0; });
    var stylesheetURI = this.prefs.getCharPref('icongridstylesheet'),
        imageURI = (stylesheetURI.length) ? stylesheetURI.slice(0, stylesheetURI.length - 4) + '.png' : '';
    for (var i = 0; i < iconSets.length; i++) {
      iconSetMenu.appendItem(iconSets[i].label, iconSets[i].value);
      if (imageURI == iconSets[i].value)
        iconSetMenu.selectedIndex = i;
    }
  },
  loadPrefValues: function() {
    var checkmarkStyle = 'chrome://menuiconsplus/skin/os_checkmarks_radiobuttons.css',
        checkmarkVal = document.getElementById('checkmark-style-radiogroup').value;
    if (checkmarkVal == 1)
      checkmarkStyle = 'chrome://menuiconsplus/skin/alt_checkmarks_radiobuttons.css';
    else if (checkmarkVal == 2)
      checkmarkStyle = 'chrome://menuiconsplus/skin/iconset_checkmarks_radiobuttons.css';
    var newArray = new Array({name: 'checkmarkstyle',
                              value: checkmarkStyle},
                             {name: 'hidedisabledmenuicons',
                              value: (document.getElementById('hide-disabled-checkbox').checked) ? 'chrome://menuiconsplus/skin/hide_disabled.css' : ''},
                             {name: 'usethememenuicons',
                              value: (document.getElementById('theme-icons-checkbox').checked) ? 'chrome://menuiconsplus/skin/browser_theme_icons.css' : ''},
                             {name: 'icongridstylesheet',
                              value: this.prefs.getCharPref('icongridstylesheet')});
    return newArray; // contains pref names and their corresponding stylesheet URI's
  },
  toggleStyleSheet: function(aChromeURI) {
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
      else
        sss.unregisterSheet(uri, sss.AGENT_SHEET);
    } catch(e) {
        Components.utils.reportError(e); // report the error
        return false;
    }
    return true;
  },
  isSheetActive: function(aChromeURI) {
    // check param
    if (typeof aChromeURI != 'string' || (aChromeURI.slice(0, 9) != 'chrome://' &&
                                          aChromeURI.slice(0, 8) != 'file:///')) // restricted to local URI's
      return false;
    // set up stylesheet service
    var sss = Components.classes['@mozilla.org/content/style-sheet-service;1']
                        .getService(Components.interfaces.nsIStyleSheetService);
    var ios = Components.classes['@mozilla.org/network/io-service;1']
                        .getService(Components.interfaces.nsIIOService);
    try {
      var uri = ios.newURI(aChromeURI, null, null);
      return sss.sheetRegistered(uri, sss.AGENT_SHEET);
    } catch(e) {
        Components.utils.reportError(e); // report the error
        return false;
    }
  },
  getCustomDir: function() {
    var dir = Components.classes['@mozilla.org/file/directory_service;1']
                        .getService(Components.interfaces.nsIProperties)
                        .get('ProfD', Components.interfaces.nsIFile);
    dir.append('customicons');
    if (!dir.exists() || !dir.isDirectory()) // if the folder doesn't exist, create it
      dir.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, parseInt("0777", 8));
    return dir;
  }
};
window.addEventListener('load', function(e) { menuIconOptions.onLoad(e); }, false);
