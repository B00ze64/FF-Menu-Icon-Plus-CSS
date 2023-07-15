# Menu Icon Plus CSS (MIP/CSS) v2.7
## Add Icons To Firefox Menus/Context-Menus/Panels

**Panels are here!** Most of the panels code comes from:

* Black7375's (MS_Y) Firefox-UI-Fix project (https://github.com/black7375/Firefox-UI-Fix).
* The Avatar, and the Sync icon preceding the Sync Now label in the panels, would definitively NOT be here without that project. If you are not using the Firefox menus, and are using SVG icons, head over to Firefox-UI-Fix!

**Menu Icon Plus CSS** is a bunch of CSS files (and images) that you *@import* in your *userChrome.css* and *userContent.css* files in Firefox to add icons to the Firefox interface. It styles every menuitem that exists in XUL, and thanks to Black7375, it now also styles the panels (those white-background menus, like the hamburger button).

The project is a remake of the classic [Menu Icon Plus XUL extension](http://www.codedawn.com/menu-icons-plus.php) for Firefox by **Justin Rodes**. The extension of course no longer works, but as I worked with its files, I discovered it wasn't working well in my FF52: It had a lot more icons than were applied, so you may discover many icons in **MIP/CSS** that you were not seeing before with the extension. Also, the Menu Icon Plus XUL extension styled all the Firefox Menus *and several other extensions on top of that.* **MIP/CSS** does not pretend to style extensions, except the built-in ones. There *is* a file included (*mip_worksheet-AddIconsToExtensions.css*) which does add icons to some extensions, but this is for my own use and not intended to be grown to support every extension out there.

AFAIK, I've styled every XUL menu/menuitem in Firefox; I've styled stuff I cannot even see, but if you find something I've forgotten, open an issue. The method used to add the icons to the menus was suggested by Aris-t2 (thanks!), and it inserts an element (an image) before the menuitems. Because of this, when a menu item is greyed-out by Firefox, I have to know about it in advance, so that I can also grey-out the icon. I think I have covered all the menuitems that *can* be greyed-out, but you may find some I've forgotten (open an issue to let me know).

You might not agree with some icons choices, or choice of selectors, feel free to open an issue. Note that some menuitems can only be selected by their labels, and labels change with the language used in Firefox, so some things, very few, will not style correctly if your Firefox is not in English; feel free to open an issue and we can add your own language's labels to the CSS files, or suggest a different selector.

This project is (c) Sylvain "B00ze64" B. and released under the Creative Commons Attribution License v4.0.

# Pre-Requisites

Besides copying all the project's files correctly in your profile/chrome folder and modifying your *userChrome.css* and *userContent.css*, there is only one pre-requisite. Basically, if you want to style the bookmarks folders correctly, you need **Aris-t2's css/generalui/bookmark_icons_colorized.css** file. For v2.0 of **MIP/CSS**, I've included the images that this file requires, in the "image" folder, so all you need is Aris's **bookmark_icons_colorized.css** file. That file needs to be in the **css/generalui** folder, and *@import'ed* in your userChrome/userContent files **BEFORE** the **MIP/CSS** files, the later of which override the images used by the former. The **bookmark_icons_colorized.css** and related files can be found at Aris-t2's [CustomCSSforFx](https://github.com/Aris-t2/CustomCSSforFx).

# Supported Versions

This project began with Firefox 78 if I recall correctly. Adjustments were made as Firefox evolved. Previous menus are still supported, but some icons might no longer work on previous versions. This project is currently tested on Windows 10 with the Light Theme, where the PNG images look really good.

# The Icon Themes

The original Menu Icon Plus XUL extension included 5 themes, and **Menu Icon Plus CSS (MIP/CSS)** includes all 5, plus 2 more: There is a **Firefox** "Theme" which you can use to override icons from other themes with the old PNG icons from Firefox 24 and 52, and **Fugue Plus** which is a mix of Fugue and whatever icon I find better looking from the other themes. I have tested all of them when I first created their CSS, but the only theme I've really spent a lot of time on is **Fugue Plus**, and it's the only one I really test when I do updates. You are encouraged to open issues and make corrections or suggestions.

All the Themes in Alphabetical order: 

1. **The Crystal Project**
    1. http://www.everaldo.com/
    2. https://commons.wikimedia.org/wiki/Category:Crystal_Project
    
2. The **Firefox** Theme (overrides some icons with old FF24/52 ones; Menus can be used alone)

3. **Fugue** icons by Yusuke Kamiyamane (http://p.yusukekamiyamane.com/)

4. **Fugue Plus** (uses Fugue and Crystal and some other icons)

5. **Oxygen**

    1. https://web.archive.org/web/20100301151643/https://www.oxygen-icons.org/
    2. https://github.com/pasnox/oxygen-icons-png

6. **Silk** icons by Mark James, Birmingham (UK) (http://www.famfamfam.com/)

7. **Tango** (http://tango-project.org/)

# File Structure

Every theme has up to 3 files, and some override files which only change the picture used but do not themselves insert the icon element (you use them AFTER a complete theme file). Let's take the Crystal theme for example, you will find:

* mip_Crystal-Library.css:
    * This is used in *userContent.css* and adds icons to the Bookmarks Library when you are opening it inside a Tab. This currently works well only in Windows 10; on Win 7 the menus are really strange and not working well.
* **mip_Crystal-Menus.css**:
    * This is used in *userChrome.css* and adds icons to the Firefox menus and to the Library window.
* **mip_Crystal-Panels.css**:
    * This is used in *userChrome.css* and adds icons to the Firefox panels.
* mip_override_CutCopyPaste-Crystal.css:
    * This gives whatever theme is used before it, the Cut/Copy/Paste icons from Crystal.

# Installation

Just extract the project into your *Profile/chrome* folder, so that you have *MipCss*, *MipImages* and *image* folders **inside** the *chrome* folder. Use the included *userChrome.css* and *userContent.css* as templates to modify your own. You are EXPECTED to edit the userChrome and userContent files to select WHICH theme you want to use. And as mentionned earlier, you are **strongly encouraged** to install the *bookmark_icons_colorized.css* file from Aris-t2's [CustomCSSforFx](https://github.com/Aris-t2/CustomCSSforFx).

NOTE that starting with v2.7, you need to import 2 additional files in *userChrome.css* (mip_ConfigMenus.css and mip_ConfigPanels.css) and 1 file in *userContent.css* (mip_ConfigMenus.css), preferably before the theme files themselves. So *userChrome.css* should look like this:

`@import "./css/generalui/bookmark_icons_colorized.css";`
`@import "./MipCss/mip_ConfigMenus.css";`
`@import "./MipCss/mip_ConfigPanels.css";`
`@import "./MipCss/mip_FuguePlus-Menus.css";`
`@import "./MipCss/mip_FuguePlus-Panels.css";`
`@import "./MipCss/mip_worksheet-AddIconsToExtensions.css";`

# Public Domain Images

There are a FEW images in the PublicDomain folder that I downloaded off from generic icon sites which have no attribution. If you recognize your work, please open an issue so that proper credits can be given.

# Themes Previews (v1.0)

### The Crystal Project
![preview](preview_Crystal.jpg)
### Fugue
![preview](preview_Fugue.jpg)
### Fugue Plus
![preview](preview_FuguePlus.jpg)
### Oxygen
![preview](preview_Oxygen.jpg)
### Silk
![preview](preview_Silk.jpg)
### Tango
![preview](preview_Tango.jpg)
