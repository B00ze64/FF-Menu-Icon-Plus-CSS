# Menu Icon Plus CSS (MIP/CSS) v1.0
# Add Icons To Firefox Menus/Context-Menus
### (c) Sylvain "B00ze64" B.

This project is a bunch of CSS files that you *@import* from your **userChome.css** and **userContent.css** in Firefox to add icons to the Firefox toolbar menus and to various context menus. It currently styles every menuitem that exists in XUL, but the **panels** (those new white pop-up menus, which are grey in Darkmode) are not yet styled, that will come later.

The project is a "remake" of the classic **Menu Icon Plus XUL extension** for Firefox by **Justin Rodes**. The extension of course no longer works, and as I worked with its files, I discovered it wasn't working too well in my old FF52 - it had a lot more icons then were applied. The **Menu Icon Plus extension** styled all the Firefox Menus and several other extensions on top of that. **FF-Menu-Icon-Plus-CSS (MIP/CSS)** does not pretend to style extensions except the built-in ones. There **is** a file included which does add icons to some extensions, but this is for my own use and not itended to be grown to support every extension out there.

AFAIK, I've styled every XUL menu/menuitem in Firefox; I've styled stuff I cannot even see, but if you find something I've forgotten, open an issue. The method used to add the icons was suggested by Aris-t2 (thanks!), and it inserts a CSS element before the menuitems. Because of this, it is not possible to globally make every disabled menuitem greyed-out in a single CSS statement. I think I have covered all the meuitems that *can* be disabled, but you may find some I've forgotten (open an issue to let me know).

You might not agree with some icons choices, or choice of selectors, feel free to open an issue. Note that some menuitems can only be selected by their labels, and labels change with the language used in Firefox, so some things, very few, will not style correctly if your Firefox is not in English; feel free to open an issue and we can add your own language's labels to the CSS files.

# Pre-Requisites

Besides copying all the projet's files correctly in your profile/chrome folder and modifying your userChrome.css and userContent.css, there is only one pre-requisite. Basically, if you want to style the bookmarks folders correctly, you need **Aris-t2's css/generalui/bookmark_icons_colorized.css** and the images it references. That file needs to be *@import'ed* in your userChrome/userContent **BEFORE** the MIP/CSS files, which override the images used by the former.

The **css/generalui/bookmark_icons_colorized.css** and related files can be found at Aris-t2's [CustomCSSforFx](https://github.com/Aris-t2/CustomCSSforFx).

# The Icon Themes

The original **Menu Icon Plus extension** included 5 themes, and **FF-Menu-Icon-Plus-CSS (MIP/CSS)** includes all 5, plus 3 more: There is a **Firefox SVG** theme which uses exclusively built-in Firefox SVG icons, a Firefox "Theme" which you can use to override icons from other themes with the old PNG icons from Firefox 24 and 52, and **Fugue Plus** which is a mix of Fugue and whatever icon I find better looking from the other themes. I have tested all of them, but the only theme I've really spent a lot of time on is **Fugue Plus**. You are encouraged to open issues and make corrections/suggestions, especially for **Firefox SVG**.

In Alphabetical order: 

1. **The Crystal Project**
    1. http://www.everaldo.com/
    2. https://commons.wikimedia.org/wiki/Category:Crystal_Project
2. **Firefox** (overrides some icons with old FF24/52 ones)
3. **Firefox SVG** (uses built-in Firefox SVG icons)
4. **Fugue**
    1. by Yusuke Kamiyamane
    2. http://p.yusukekamiyamane.com/
5. **Fugue Plus** (uses Fugue and Crystal and some other icons)
6. **Oxygen**
    1. https://web.archive.org/web/20100301151643/https://www.oxygen-icons.org/
    2. https://github.com/pasnox/oxygen-icons-png
7. **Silk**
    1. by Mark James, Birmingham (UK)
    2. http://www.famfamfam.com/
8. **Tango**
    1. http://tango-project.org/

# Themes Previews

### The Crystal Project
![preview](preview_Crystal.jpg)
### Firefox SVG
![preview](preview_FirefoxSVG.jpg)
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
