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

var menuIconImport = {
  onLoad: function() {
    this.strings = document.getElementById('menuiconsplus-strings');
    this.prompts = Components.classes['@mozilla.org/embedcomp/prompt-service;1']
                             .getService(Components.interfaces.nsIPromptService);
    this.pngFileToImport = null;
    this.cssFileToImport = null;
    this.cssInputIndex = 0;
    // unhide extra button
    var helpBtn = document.getElementById('menuiconsplus-import-wizard')._extra1Button;
    helpBtn.label = this.strings.getString('helpButton');
    helpBtn.accessKey = this.strings.getString('helpAccessKey');
    helpBtn.tooltipText = this.strings.getString('helpToolTip');
    helpBtn.setAttribute('oncommand', 'menuIconImport.showHelp();'); // the "onextra1" wizard attribute doesn't seem to work for some reason
    helpBtn.hidden = false;
    this.initialized = true;
  },
  onPageShow: function(aPgNum) {
    // set page header labels
    var wiz = document.getElementById('menuiconsplus-import-wizard'),
        wizLabel = document.getElementById('menuiconsplus-strings').getFormattedString('importIconSetWizardHeader', [aPgNum]);
    wiz._wizardHeader.setAttribute('label', wizLabel);
    var textBox = (aPgNum == 1) ? document.getElementById('menuiconsplus-import-png-textbox')
                                : document.getElementById('menuiconsplus-import-css-textbox');
    this.okToAdvance(textBox.value.length || textBox.disabled);
    if (aPgNum == 3) {
      // update descriptions of pending tasks
      var pngDescr = document.getElementById('menuiconsplus-import-png-description'),
          cssDescr = document.getElementById('menuiconsplus-import-css-description');
      pngDescr.textContent = this.strings.getFormattedString('importPNGDescription', [this.pngFileToImport.path]);
      cssDescr.textContent = (this.cssFileToImport) ? this.strings.getFormattedString('importCSSDescription', [this.cssFileToImport.path])
                                                    : this.strings.getString('generateCSSDescription');
    }
  },
  toggleCSSInput: function() {
    var radioGroup = document.getElementById('menuiconsplus-import-css-radiogroup'),
        textBox = document.getElementById('menuiconsplus-import-css-textbox'),
        browseBtn = document.getElementById('menuiconsplus-import-css-button');
    if (radioGroup.selectedIndex != this.cssInputIndex) {
      this.cssInputIndex = radioGroup.selectedIndex;
      textBox.disabled = !textBox.disabled;
      browseBtn.disabled = !browseBtn.disabled;
      if (!textBox.disabled)
        textBox.focus();
      this.okToAdvance(textBox.value.length || textBox.disabled);
    }
  },
  showFilePicker: function(aFilterTitle, aFilterMask) {
    var nsIFilePicker = Components.interfaces.nsIFilePicker,
        fp = Components.classes['@mozilla.org/filepicker;1'].createInstance(nsIFilePicker);
    fp.init(window, this.strings.getString('filepickerSelectFile'), nsIFilePicker.modeOpen);
    fp.appendFilter(aFilterTitle, aFilterMask);
    if (aFilterMask == '*.png') {
      try {
        fp.displayDirectory = Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties).get('Pers', Components.interfaces.nsIFile);
      }
      catch(e) {
        fp.displayDirectory = Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties).get('Desk', Components.interfaces.nsIFile);
      }
    }
    var result = fp.show();
    if (result == nsIFilePicker.returnOK)
      return fp.file;
    return null;
  },
  getFileFromPicker: function(aFileType) {
    switch (aFileType) {
      case 'png':
        var filterTitle = this.strings.getString('pngfilterTitle'),
            filterMask = '*.png',
            textBox = document.getElementById('menuiconsplus-import-png-textbox');
        break;
      case 'css':
        var filterTitle = this.strings.getString('cssfilterTitle'),
            filterMask = '*.css',
            textBox = document.getElementById('menuiconsplus-import-css-textbox');
        break;
      default:
        return null;
    }
    var file = this.showFilePicker(filterTitle, filterMask);
    // update text box value
    if (file) {
      textBox.value = file.path;
      this.okToAdvance(true);
      document.getElementById('menuiconsplus-import-wizard').getButton('next').focus();
    }
    return file;
  },
  onNextPage: function(aPgNum) {
    // check the textbox for a valid PNG/CSS file path, then validate the file specified
    switch (aPgNum) {
      case 1:
        var textBox = document.getElementById('menuiconsplus-import-png-textbox'),
            fileName = textBox.value,
            file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
        try {
          file.initWithPath(fileName);
        }
        catch(e) {
          this.prompts.alert(null, this.strings.getString('errorTitle'), this.strings.getString('errorInvalidFileNameMessage'));
          textBox.focus();
          textBox.select();
          return false;
        }
        // ensure that it's an existing PNG file
        var fileExt = fileName.slice(fileName.length - 4, fileName.length).toLowerCase();
        if (!file.exists() || fileExt != '.png') {
          this.prompts.alert(null, this.strings.getString('errorTitle'), this.strings.getString('errorNonexistentPNGMessage'));
          textBox.focus();
          textBox.select();
          return false;
        }
        // also make sure we don't overwrite the default files
        if (['crystal project.png',
             'fugue.png',
             'oxygen.png',
             'silk.png',
             'tango.png'].indexOf(file.leafName.toLowerCase()) > -1) {
          this.prompts.alert(null, this.strings.getString('errorTitle'), this.strings.getString('errorDontOverwriteMessage'));
          textBox.focus();
          textBox.select();
          return false;
        }
        this.pngFileToImport = file;
        break;
      case 2:
        // only validate if the user wants to specify their own stylesheet
        if (!document.getElementById('menuiconsplus-import-css-radiogroup').selectedIndex)
          return true;
        var textBox = document.getElementById('menuiconsplus-import-css-textbox'),
            fileName = textBox.value,
            file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
        try {
          file.initWithPath(fileName);
        }
        catch(e) {
          this.prompts.alert(null, this.strings.getString('errorTitle'), this.strings.getString('errorInvalidFileNameMessage')); 
          textBox.focus();
          textBox.select();
          return false;
        }
        // ensure that it's an existing CSS file
        var fileExt = fileName.slice(fileName.length - 4, fileName.length).toLowerCase();
        if (!file.exists() || fileExt != '.css') {
          this.prompts.alert(null, this.strings.getString('errorTitle'), this.strings.getString('errorNonexistentCSSMessage'));
          textBox.focus();
          textBox.select();
          return false;
        }
        this.cssFileToImport = file;
        break;
      default:
    }
    return true;
  },
  showHelp: function() {
    var wm = Components.classes['@mozilla.org/appshell/window-mediator;1']
                       .getService(Components.interfaces.nsIWindowMediator);
    var browserWindow = wm.getMostRecentWindow('navigator:browser');
    browserWindow.gBrowser.selectedTab = browserWindow.gBrowser.addTab(this.strings.getString('helpURL'));
    browserWindow.focus();
  },
  onFinish: function() {
    // import PNG file
    // before doing the copy, confirm if a file of that name already exists in the destination folder
    var file = this.pngFileToImport,
        iconSetName = file.leafName.slice(0, -4),
        dir = window.opener.menuIconOptions.getCustomDir(), // dir is the customicons folder, where user-made icon sets are stored
        fileTestPNG = dir.clone();
    fileTestPNG.append(file.leafName);
    if (fileTestPNG.exists()) {
      var confirmMsg = this.strings.getFormattedString('confirmFileOverwriteMessage', [iconSetName]),
          result = this.prompts.confirm(null, this.strings.getString('confirmFileReplaceTitle'), confirmMsg);
      if (result) { // go ahead and overwrite it
        var fileTestCSS = dir.clone();
        fileTestCSS.append(iconSetName + '.css');
        try {
          fileTestPNG.remove(false);
          if (fileTestCSS.exists())
            fileTestCSS.remove(false);
        }
        catch (e) {
          Components.utils.reportError(e);
          this.prompts.alert(null, this.strings.getString('errorTitle'), this.strings.getString('errorCantOverwriteIconSetMessage'));
          return;
        }
      }
      else // abort the mission
        return;
    }
    try {
      file.copyTo(dir, '');
    }
    catch (e) {
      Components.utils.reportError(e);
      this.prompts.alert(null, this.strings.getString('errorTitle'), this.strings.getString('errorCantImportPNGMessage'));
      return;
    }

    // import CSS file, if any
    var file = this.cssFileToImport;
    if (!file) {
      // generate a stylesheet
      file = dir.clone();
      file.append(iconSetName + '.css');
      var data = '/* ***** ' + this.strings.getFormattedString('cssFileTitle', [iconSetName.toUpperCase()]) + ' *****\n * ' +
                 this.strings.getString('cssFileHeader1') + '\n * ' + this.strings.getString('cssFileHeader2') + '\n * ' +
                 this.strings.getString('helpURL') + '\n */\n\n@namespace url("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul");\n\n';
      data += '/* ' + this.strings.getString('_blank') + ' */\nmenuitem[type="checkbox"],\nmenuitem[type="radio"],\nmenuitem#menuitem_learnMore_clone,\nmenuitem[command="cmd_about"],\nmenuitem[command="cmd_uninstall"],\nmenuitem#links-mitem,\n#viewSource-main-menubar menuitem#menu_close,\nmenu#noscript-menu-blocked-objects,\nmenu#misc menuitem#remove\n';
      data += '{ list-style-image: none !important; }\n\n';
      var selectors = [
        '/* ' + this.strings.getString('_checkmark') + ' */\nmenuitem[checked="true"],\nmenuitem[type="checkbox"][checked="true"],\nmenuitem[type="radio"][checked="true"],\ntoolbarbutton#addAddressPanel.checked,\ntoolbarbutton#addAddressPanel.checked:hover',
        '/* ' + this.strings.getString('_browseBack') + ' */\nmenuitem[oncommand="BrowserBack(event, true)"],\nmenuitem[oncommand="BrowserForward(event, true)"]:-moz-locale-dir(rtl),\nmenuitem[command="Browser:Back"],\nmenuitem[command="Browser:Forward"]:-moz-locale-dir(rtl),\nmenuitem[command="Browser:BackOrBackDuplicate"],\nmenuitem[command="Browser:ForwardOrForwardDuplicate"]:-moz-locale-dir(rtl),\ntoolbarbutton[class="tabcatalog-thumbnail-toolbar-item goBack"],\ntoolbarbutton[class="tabcatalog-thumbnail-toolbar-item goForward"]:-moz-locale-dir(rtl),\n#thumb-back .toolbarbutton-icon,\n#thumb-forward .toolbarbutton-icon:-moz-locale-dir(rtl),\n#prior-button,\n#next-button:-moz-locale-dir(rtl),\nmenuitem[oncommand="prior_click();"],\nmenuitem[oncommand="next_click();"]:-moz-locale-dir(rtl)',
        '/* ' + this.strings.getString('_browseFwd') + ' */\nmenuitem[oncommand="BrowserForward(event, true)"],\nmenuitem[oncommand="BrowserBack(event, true)"]:-moz-locale-dir(rtl),\nmenuitem[command="Browser:Forward"],\nmenuitem[command="Browser:Back"]:-moz-locale-dir(rtl),\nmenuitem[command="Browser:ForwardOrForwardDuplicate"],\nmenuitem[command="Browser:BackOrBackDuplicate"]:-moz-locale-dir(rtl),\ntoolbarbutton[class="tabcatalog-thumbnail-toolbar-item goForward"],\ntoolbarbutton[class="tabcatalog-thumbnail-toolbar-item goBack"]:-moz-locale-dir(rtl),\n#thumb-forward .toolbarbutton-icon,\n#thumb-back .toolbarbutton-icon:-moz-locale-dir(rtl),\n#next-button,\n#prior-button:-moz-locale-dir(rtl),\nmenuitem[oncommand="next_click();"],\nmenuitem[oncommand="prior_click();"]:-moz-locale-dir(rtl)',
        '/* ' + this.strings.getString('_browseReload') + ' */\nmenuitem[command="Browser:Reload"],\nmenuitem[command="Browser:ReloadOrDuplicate"],\n#placesContext_reload,\n#context_reloadTab,\n#context-reloadframe,\nmenuitem[command="cmd_reload"],\n#fastdial-menu-refresh,\n#groupcontext-refreshall,\n#thumbMenu #context-refresh,\n#context-reload,\nmenuitem[commandname="reload-source-tab"]',
        '/* ' + this.strings.getString('_browseStop') + ' */\nmenuitem[command="Browser:Stop"]',
        '/* ' + this.strings.getString('_browseHome') + ' */\nmenuitem[oncommand="BrowserGoHome(event);"],\nmenuitem[command="cmd_homepage"],\nmenuitem[oncommand="minimapNS.setMapHome();"],\nmenuitem[anonid="homepage"]',
        '/* ' + this.strings.getString('_edit') + ' */\n#mnEdit,\n#mnEditEdit,\n#modifySelected,\nmenuitem[oncommand="edit_click();"],\n#editmacro,\nmenuitem[oncommand="minimapNS.edit_Kml()"],\nmenuitem[command="cmd_editalias"],\n#edit-menu,\nmenuitem[anonid="context-edit"],\n#groupcontext-edit,\n#thumbMenu #context-edit,\nmenuitem[oncommand="editReminder()"],\nmenuitem[oncommand="editTodo()"],\n#menuitem_userscript_edit,\nmenuitem[commandname="change-value"]',
        '/* ' + this.strings.getString('_editCut') + ' */\nmenuitem[command="cmd_cut"],\nmenuitem[cmd="cmd_cut"],\n#mnEditCut,\n#context-cut,\n#cut,\nmenuitem[key="key_cut"],\nmenuitem[commandname="cmd-cut"],\n#gspace_remoteCutFiles,\n#placesContext_cut,\n#appmenu-cut',
        '/* ' + this.strings.getString('_editCopy') + ' */\nmenuitem[command="cmd_copy"],\nmenuitem[cmd="cmd_copy"],\n#mnEditCopy,\nmenuitem[oncommand="viewer.cmdCopyValue();"],\n#context-copyimage-contents,\n#copyPref,\n#context-copy,\n#copy,\n#perm-copy-menuitem,\n#cookie-copy-menuitem,\nmenuitem[key="key_copyallurls"],\nmenuitem[key="key_copy"],\nmenuitem[commandname="cmd-copy-link-url"],\nmenuitem[commandname="cmd-copy"],\n#cx-copy,\nmenuitem[oncommand="foxytunesTrackTitleCopyToClipBoard();"],\n#gspace_remoteCopyFiles,\n#context-highlighter-copy,\nmenuitem[oncommand="copyKey();"],\n.copyButtonImage,\n#tabberwocky-copytabtitle,\nmenuitem[command="rikaichan-copy-cmd"],\nmenuitem[oncommand="copyReminder()"],\nmenuitem[oncommand="copyTodo()"],\n#placesContext_copy,\n#appmenu-copy,\nmenuitem[oncommand="titoCommand.errorCopy(event);"],\nmenuitem[value="duplicate"],\n#context-copylink,\nmenuitem[commandname="copy-qual-name"],\nmenuitem[command="cmdCopyValue"],\n#request-menu-context-copy-url',
        '/* ' + this.strings.getString('_editPaste') + ' */\nmenuitem[command="cmd_paste"],\nmenuitem[cmd="cmd_paste"],\n#mnEditPaste,\n#mnEditPasteMenu,\n#context-paste,\n#paste,\nmenuitem[key="key_paste"],\nmenuitem[commandname="cmd-paste"],\n#gspace_remotePaste,\n#placesContext_paste,\n#appmenu-paste',
        '/* ' + this.strings.getString('_editUndo') + ' */\nmenuitem[cmd="cmd_undo"],\nmenuitem[command="cmd_undo"],\nmenuitem[command="cmdEditUndo"],\n#context_undoCloseTab,\n#tm-content-undoCloseTab,\n#autocopy-context-menu-undocopy,\n#nukeanything-undo-nuke,\nmenuitem[commandname="cmd-undo"],\nmenuitem[oncommand="cmd_undo"],\nmenuitem[key="key_undo"]',
        '/* ' + this.strings.getString('_editRedo') + ' */\nmenuitem[command="cmd_redo"],\nmenuitem[command="cmdEditRedo"],\nmenuitem[commandname="cmd-redo"],\nmenuitem[key="key_redo"]',
        '/* ' + this.strings.getString('_editDelete') + ' */\nmenuitem[cmd="cmd_delete"],\nmenuitem[command="cmd_delete"],\nmenuitem[command="cmdEditDelete"],\n#context-remove,\n#remove,\n#perm-delete-menuitem,\n#cookie-delete-menuitem,\nmenuitem[oncommand="db_startDelete(db_findDLNode(document.popupNode), event);"],\nmenuitem[oncommand="localTree.remove()"],\nmenuitem[oncommand="remoteTree.remove()"],\nmenuitem[id^="nukeanything-do-nuke"],\nmenuitem[commandname="cmd-delete"],\nmenuitem[oncommand="ybBookmarksMenu.deleteBookmark();"],\nmenuitem[anonid="ybContextMenu-delete-bookmark"],\nmenuitem#delete,\n#fastdial-menu-clear,\nmenuitem[oncommand="gs_gLocalTreeView.DeleteSelected();"],\n#gspace_remoteDeleteSelected,\n#sbPopupRemove,\nmenuitem[oncommand="sbPageEditor.cutter();"],\nmenuitem[oncommand="sbTradeService.remove();"],\n#deleteCache,\n#delete-menuitem,\n#ctx-delete-feed,\n#ctx-delete-folder,\n#ctx-delete-tag,\n#remove,\nmenuitem[oncommand="minimapNS.delete_Kml()"],\n#minimap-delete,\n#menu_delete,\n#tm-sessionmanager menu[anonid="delete"] > .menu-iconic-left,\n#tm-sessionmanager:hover menu[anonid="delete"] > .menu-iconic-left,\n#tm-sm-Delete,\nmenuitem[oncommand="deleteSearchPlugin();"],\nmenuitem[oncommand="deleteCategory()"],\n#groupcontext-remove,\n#thumbMenu #context-deassign,\nmenuitem[oncommand="userDeleteReminder()"],\nmenuitem[oncommand="userDeleteTodo()"],\n#editdial-clear,\nmenuitem[command="placesCmd_delete"],\nmenuitem[value="remove"],\nmenuitem#deleteItem,\nmenuitem[key="key_delete"]',
        '/* ' + this.strings.getString('_find') + ' */\nmenuitem[command="cmd_find"],\nmenuitem[oncommand="inspector.getViewer(\'dom\').showFindDialog()"],\n#find,\n#searchMenuItem,\nmenuitem[commandname="find"],\nmenuitem[command="cmd_focusFirebugSearch"],\nmenuitem[oncommand="doFind()"],\nmenuitem[commandname="find-string"],\nmenuitem[key="tokenSearchKey"]',
        '/* ' + this.strings.getString('_windowNew') + ' */\n#menu_newNavigator,\n#placesContext_open\\:newwindow,\n#context-openlink,\n#context-openframe,\nmenuitem[commandname="goto-url-newwin"],\n#cx-openwindow,\n#yb-bookmarks-context-menu-open-in-new-window,\nmenuitem[anonid="ybContextMenu-open-in-new-window"],\n#rssOpenNewWindowItem,\nmenuitem[oncommand="gperformancing.launchWindow(\'chrome://performancing/content/scribefire.xul\')"],\n#tm-sm-OpenInNewWindow,\n#context_openTabInWindow,\n#thumbMenu #context-openwindow,\n#appmenu_newNavigator,\n#MinTrayR_menu_newNavigator,\nmenuitem[value="search:@newwindow"],\n#sp-menu-newscratchpad,\n#mnEditInspectInNewWindow',
        '/* ' + this.strings.getString('_tabNew') + ' */\n#menu_newNavigatorTab,\n#placesContext_open\\:newtab,\n#context_newTab,\n#context-openlinkintab,\n#context-openframeintab,\n#contextOpen,\n#autocopy-context-menu-openinnewtab,\nmenuitem[key="key_openurls"],\n#ddg_menu_go_f,\nmenuitem[commandname="goto-url-newtab"],\n#cx-opentab,\n#yb-bookmarks-context-menu-open-in-new-tab,\nmenuitem[anonid="ybContextMenu-open-in-new-tab"],\n#mopen,\n#fastdial-menu-open-tab,\n#rssOpenNewTabItem,\n#sbPopupOpenNewTab,\nmenuitem[oncommand="sbTradeService.open(true);"],\nmenuitem[oncommand="sbCalcController.open(true);"],\nmenuitem[oncommand="gperformancing.launchWindowInTab(\'chrome://performancing/content/scribefire.xul\')"],\nmenuitem[oncommand="CacheViewer.openCache();"],\n.openintabs-menuitem,\n#placesContext_openContainer\\:tabs,\n#placesContext_open\\:newtab,\n#placesContext_openLinks\\:tabs,\n#tabberwocky-openselectedlinks,\n#groupcontext-openall,\n#thumbMenu #context-opentab,\nmenuitem[oncommand="RemoteTabViewer.openSelected()"],\n#appmenu_newTab,\n#appmenu_newTab_popup,\nmenuitem[value="search:@newtab"],\nmenuitem[commandname="find-scriptinstance"],\nmenuitem[commandname="find-url"]',
        '/* ' + this.strings.getString('_fileOpen') + ' */\n#menu_openFile,\n#menuitem_open,\nmenuitem[oncommand="db_startOpenFinished(db_findDLNode(document.popupNode));"],\nmenuitem[key="key_open"],\n#cx-open-ext,\n#cx-open,\n#FirebugMenu_OpenWith,\nmenuitem[command="cmd_foxytunes-play-file"],\n#launch,\n#sbPopupOpen,\nmenuitem[oncommand="sbTradeService.open(false);"],\nmenuitem[oncommand="sbCalcController.open(false);"],\n#firefusk-openin-menu,\n#file-menu,\n#appmenu_openFile,\n#traceToolsMenu #loadFromFile,\n#sp-menu-open',
        '/* ' + this.strings.getString('_tabClose') + ' */\nmenuitem[command="cmd_close"],\n#context_closeTab,\n#tm-content-closetab,\nmenuitem[commandname="delete-view"],\nmenuitem[command="cmd_closetab"]',
        '/* ' + this.strings.getString('_saveAs') + ' */\n#context-savelink,\n#context-saveimage,\n#context-savepage,\n#context-saveframe,\nmenuitem[key="key_savePage"],\nmenuitem[command="Browser:SaveFrame"],\n#mi-save,\nmenuitem[oncommand="ddg_ges.SaveAs(this.parentNode.Data);"],\nmenuitem[commandname="save"],\n#cx-saveas,\nmenuitem[oncommand="CacheViewer.saveCache();"],\nmenuitem[oncommand="gContextMenu.saveMedia();"],\nmenuitem[commandname="save-source-tab"],\n#appmenu_savePage',
        '/* ' + this.strings.getString('_sendLink') + ' */\n#context-sendlink,\n#context-sendpage,\n#menu_sendLink,\n#context-sendimage,\nmenuitem[oncommand="minimapNS.shareLocation(\'email\');"],\nmenuitem[oncommand="gContextMenu.sendMedia();"],\n#appmenu_sendLink',
        '/* ' + this.strings.getString('_pageSetup') + ' */\nmenuitem[command="cmd_pageSetup"],\nmenuitem[command="cmd_pagesetup"]',
        '/* ' + this.strings.getString('_printPreview') + ' */\nmenuitem[command="cmd_printPreview"],\nmenuitem[command="cmd_printpreview"]',
        '/* ' + this.strings.getString('_print') + ' */\nmenuitem[command="cmd_print"],\n#context-printframe,\nmenuitem[commandname="print"],\nmenuitem[oncommand="minimapNS.minimapPrint();"],\n#appmenu_print',
        '/* ' + this.strings.getString('_exit') + ' */\n#menu_FileQuitItem,\n#appmenu-quit,\n#MinTrayR_menu_FileQuitItem',
        '/* ' + this.strings.getString('_zoomIn') + ' */\nmenuitem[command="cmd_fullZoomEnlarge"],\n#menu_textEnlarge,\nmenuitem[oncommand="web-developer_zoom(true)"] .menu-iconic-icon,\n#context-zoom-zin,\n#zoomsub-zin',
        '/* ' + this.strings.getString('_zoomOut') + ' */\nmenuitem[command="cmd_fullZoomReduce"],\n#menu_textReduce,\nmenuitem[oncommand="web-developer_zoom(false)"] .menu-iconic-icon,\n#context-zoom-zout,\n#zoomsub-zout',
        '/* ' + this.strings.getString('_viewSource') + ' */\n#context-viewframesource,\n#context-viewpartialsource-selection,\n#context-viewpartialsource-mathml,\n#context-viewsource,\nmenuitem[command="View:PageSource"],\nmenuitem[key="key_viewSource"],\n#cx-view-source,\n#view-userscript,\n.subviewbutton[key="key_viewSource"]',
        '/* ' + this.strings.getString('_fullScreen') + ' */\n#fullScreenItem:not([checked="true"]),\n#appmenu_fullScreen:not([checked="true"])',
        '/* ' + this.strings.getString('_history') + ' */\nmenuitem[oncommand="toggleSidebar(\'viewHistorySidebar\');"],\nmenuitem[command="Browser:ShowAllHistory"],\nmenuitem[key="key_gotoHistory"],\n#febe_tools_menu_restoreHistory,\n#history-menu,\n#appmenu_history,\n#appMenuViewHistorySidebar:not([checked="true"])',
        '/* ' + this.strings.getString('_bookmarks') + ' */\nmenuitem[oncommand="toggleSidebar(\'viewBookmarksSidebar\');"],\nmenuitem[key="viewBookmarksSidebarKb"],\n#febe_tools_menu_restoreBookmarks,\n#bookmarksMenu,\n#appmenu_bookmarks,\n#appmenu_showAllBookmarks,\n#BMB_bookmarksShowAll,\n#panelMenu_viewBookmarksSidebar:not([checked="true"])',
        '/* ' + this.strings.getString('_bookmarkThisPage') + ' */\nmenuitem[command="Browser:AddBookmarkAs"],\n#context_bookmarkTab,\n#context-bookmarklink,\n#context-bookmarkpage,\n#context-bookmarkframe,\n#addBookmarkContextItem,\n#placesContext_createBookmark,\nmenuitem[oncommand="RemoteTabViewer.bookmarkSingleTab(event)"],\n#panelMenuBookmarkThisPage',
        '/* ' + this.strings.getString('_bookmarkNew') + ' */\n#placesContext_new\\:bookmark,\nmenuitem[oncommand="ybBookmarksMenu.newBookmark(event);"],\nmenuitem[anonid="ybContextMenu-new-bookmark"],\n.abhere-menuitem',
        '/* ' + this.strings.getString('_folderNew') + ' */\n#placesContext_new\\:folder,\nmenuitem[oncommand="ddg_folderManager.addNewFolder(this.parentNode.Data);"],\nmenuitem[key="key_dir"],\n#gspace_remoteAddFolder,\nmenuitem[oncommand="gs_gLocalTreeView.AddFolder();"],\nmenuitem#newfolder,\nmenuitem[command="cmd_new-folder"],\n#newbookmark',
        '/* ' + this.strings.getString('_bookmarkFeed') + ' */\n#subscribeToPageMenuitem,\n#subscribeToPageMenupopup,\n#appmenu_subscribeToPage,\n#appmenu_subscribeToPageMenu,\n#BMB_subscribeToPageMenuitem,\n#BMB_subscribeToPageMenupopup,\n#ctraddon_BMB_subscribeToPageMenuitem',
        '/* ' + this.strings.getString('_webSearch') + ' */\nmenuitem[command="Tools:Search"],\n#context-searchselect,\nmenuitem[oncommand="autocopy_searchforselection();"],\n#context-searchmenu,\n#ddg_menu_search-f,\nmenu[searchtype="general"],\n#febe_tools_menu_restoreSearchPlugins,\nmenuitem[value="search:@page"]',
        '/* ' + this.strings.getString('_downloads') + ' */\nmenuitem[command="Tools:Downloads"],\nmenuitem[key="key_openDownloads"],\n#remoteDownload,\nmenuitem[oncommand="gs_gActionTreeView.AddToActionQ(\'download\');"],\nmenuitem[oncommand="gs_gActionTreeView.DownloadTo();"],\n#firefusk-saved,\nmenuitem[key="key_dmtSidebar"]:not([checked="true"]),\nmenuitem[observes="viewDmSidebar"]:not([checked="true"])',
        '/* ' + this.strings.getString('_addOns') + ' */\nmenuitem[command="Tools:Addons"],\nmenuitem[key="aiosKey_addons"],\n#febe_tools_menu_restoreExtensions,\nmenuitem[oncommand="BrowserOpenAddonsMgr()"],\nmenuitem[observes="omnisidebar-viewAddonSidebar"]:not([checked="true"])',
        '/* ' + this.strings.getString('_pageInfo') + ' */\nmenuitem[command="View:PageInfo"],\n#context-viewframeinfo,\n#context-viewinfo,\nmenuitem[key="aiosKey_pageInfo"],\nmenuitem[observes="omnisidebar-viewPageInfoSidebar"]:not([checked="true"])',
        '/* ' + this.strings.getString('_options') + ' */\n#menu_preferences,\n#abp-toolbar-options,\n#abp-status-options,\n#qlssettings,\n#sbpqlssettings,\nmenuitem[oncommand="web-developer_options()"] .menu-iconic-icon,\nmenuitem[oncommand="gPopupBlockerObserver.editPopupSettings();"],\nmenuitem[oncommand="noscriptUtil.openOptionsDialog()"],\nmenuitem[command="cmd_options"],\n#autocopy-statusbar-getoptions,\nmenuitem[key^="key_openoption"],\n#db_openOptions,\n#prefbutton,\n#FirebugMenu_Options,\n#foxytunes-configure-player-menuitem + menuseparator + menu,\nmenuitem[oncommand="foxytunesOpenSignatuensConfigurationWindow();"],\n#gtbOptionsMenuitem,\n#febe_tools_menu_options,\nmenuitem[oncommand="window.openDialog(\'chrome://updatenotifier/content/options.xul\', \'UN:Prefs\', \'centerscreen,chrome,dependent\');"],\nmenuitem[id$="cus_new_m/cus_new_m01"],\n#showcaseOptionsMenuItem,\nmenuitem[oncommand="sbMainService.openPrefWindow();"],\nmenuitem[oncommand="objLinkify.Options()"],\n#colorzilla-menu-options,\n#context-mystickies-popup #context-mystickies,\n#menu-mystickies-options,\n#options,\n#firefusk-options,\n#ebayCompOptionsMenuItem,\nmenuitem[oncommand="minimapNS.myOptions();"],\nmenuitem[oncommand="autopagerMain.openCoreOptions();"],\nmenuitem[oncommand="openGMOptions();"],\nmenuitem[command="rikaichan-options-cmd"],\n#speeddialContext > menupopup > menuitem:last-child,\n#btn_speeddial > menupopup > menuitem:last-child,\n#speeddialBookmarksMenu > menupopup > menuitem:last-child,\nmenuitem[oncommand="reminderFox_openOptionsDialog();"],\n#nbascoreboard-options-menu,\n.gmanager-account-info > menupopup > menuitem:last-child,\n#gmanager-context-menu > menupopup > menuitem:last-child,\n#gmanager-tools-menu > menupopup > menuitem:last-child,\n#appmenu_customize,\n#appmenu_preferences,\n#menuitem_preferences,\nstatusbarpanel#preferences,\n#smxtra5-SmileyMenuOptions,\n#MultiLinks-menuOptions,\n#KeeFox_Options-Button,\nmenuitem.autofillFormsSettingsIcon,\nmenuitem[oncommand="findbartweak.doOpenOptions();"]',
        '/* ' + this.strings.getString('_help') + ' */\nmenuitem[oncommand="openHelpLink(\'firefox-help\')"],\nmenuitem[oncommand="gViewSourceChooseEditor.openHelp()"],\nmenuitem[oncommand="web-developer_help()"] .menu-iconic-icon,\nmenuitem[command="cmd_foxytunes-help-players"],\n#foxytunes-extras-menu + menuseparator + menu + menuseparator + menu + menuseparator + menu + menu,\n#gtbGoogleHelpMenu,\nmenuitem[ytrack$="cus_new_m22"][yurl*="help.yahoo.com"],\nmenuitem[id$="yas_2"],\nmenuitem[oncommand=\'Bzzster_Go("/help?src=ff")\'],\nmenuitem[oncommand="sbCommonUtils.loadURL(\'chrome://scrapbook/locale/templateHelp.html\', true);"],\n#colorzilla-about-menu-help,\n#context-mystickies-help,\n#menu-mystickies-help,\nmenuitem#help,\nmenuitem[oncommand="openUILink(\'http://www.yoono.com/help.html\', event)"],\nmenuitem[oncommand="minimapNS.minimapOpenUrl(\'help\')"],\n#tx-autopager-about,\n#st-autopager-about,\nmenuitem[oncommand="TVM.Util.openNewTab(\\"http://www.tv-manager.org/support\\");"],\n#helpMenu,\nmenuitem[oncommand="reminderFox_launchHelp();"],\n#appmenu_help,\n#smxtra5-SmileyMenuHelp,\n#similarweb_help,\n#KeeFox_Help-Button,\nmenuitem.autofillFormsHelpIcon,\nmenuitem[commandname="help"],\nmenuitem[key="key_openHelp"]'
      ];
      var k = 0;
      for (var i = 16; i <= 80; i = i + 16) {
        var top = i - 16 + 'px';
        if (top == '0px')
          top = 0;
        var bottom = i + 'px';
        for (var j = 16; j <= 160; j = j + 16) {
          var left = j - 16 + 'px',
              right = j + 'px';
          if (left == '0px')
            left = 0;
          if (k < selectors.length)
            data += selectors[k] + '\n{ -moz-image-region: rect(' + top + ', ' + right + ', ' + bottom + ', ' + left + ') !important; list-style-image: url("' + this.pngFileToImport.leafName + '") !important; }\n\n';
          else
            break;
          k++;
        }
      }
      var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
                               .createInstance(Components.interfaces.nsIFileOutputStream);
      foStream.init(file, 0x02 | 0x08 | 0x20, parseInt("0666", 8), 0); 
      foStream.write(data, data.length);
      foStream.close();
    }
    else {
      try {
        file.copyTo(dir, iconSetName + '.css');
      }
      catch (e) {
        Components.utils.reportError(e);
        this.prompts.alert(null, this.strings.getString('errorTitle'), this.strings.getString('errorCantImportCSSMessage'));
        return;
      }
    }
    var path = 'file:///' + dir.path.replace(/\\/g, '\/').replace(/^\s*\/?/, '') + '/';
    window.opener.menuIconOptions.prefs.setCharPref('icongridstylesheet', path + iconSetName + '.css');
    window.opener.menuIconOptions.updateIconSetMenu();
  },
  okToAdvance: function(aAdvFlag) {
    document.getElementById('menuiconsplus-import-wizard').canAdvance = aAdvFlag;
  }
};
window.addEventListener('load', function(e) { menuIconImport.onLoad(e); }, false);
