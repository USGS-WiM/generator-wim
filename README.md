# generator-wim

> [Yeoman](http://yeoman.io) generator for scaffolding html5/javascript web mappinng apps.  Allows for use of [ESRI](https://developers.arcgis.com/javascript/) or [Leaflet](http://leafletjs.com/) as the mapping API.   It uses bower for dependency injection and gulp as its task runner.


## Getting Started

#### 1.  Fork this repo to your personal github account

#### 2.  Clone the repo from your personal github account to your computer

## Generator Setup

#### 1.  Install required software
[node.js](http://nodejs.org)  
[github for windows](https://windows.github.com/) (only required if GUI is preferred, otherwise can use command line)  

#### 2.  Install generator global dependencies
This will install the following packages to your "C:\Users\%user%\AppData\Roaming\npm\node_modules" folder.  This can be done from any command prompt

```bash
npm install -g yo bower gulp
```

#### 3.  Create symbolic link for generator-wim inside the generator-wim folder
This 'tricks' node into thinking your generator-wim is a globally installed node module in this location: "C:\Users\%user%\AppData\Roaming\npm\node_modules"

```bash
cd generator-wim
npm link
```

#### 4.  Run the generator

```bash
md generator-wim-dev
cd generator-wim-dev
yo wim
```

---
## Editing the generator itself
The process described below is for making edits to the actual generator code, i.e. the source from which all generated apps will be generated. Exercise caution, as these edits will affect all future generations.

###1. Ensure that your local repo of generator-wim is up-to-date
run a pull  from the upstream at your local repo directory to retrieve latest from the org repo at [USGS-WiM/generator-wim](https://github.com/USGS-WiM/generator-wim).
```bash
git pull upstream master
```
 For good housekeeping, follow up your upstream pull with a push to your personal account repo so it is in sync with the org repo at [USGS-WiM/generator-wim](https://github.com/USGS-WiM/generator-wim).

```bash
git push origin master
```

###2. Generate a new app instance for development

Create a new directory for generator code development. Something like "generator-wim-dev" is recommended. You only need to do this the first time. You can always generate an app there later which will overwrite older code.

in your generator dev directory, run the yeoman command with the alias for the wim generator
```bash
yo wim
```
follow the prompts, and eventually you will have app code in your dev directory, whose contents now look like this:
```bash
bower.json gulpfile.js node_modules package.json src
```
(plus a few other tiny 1kb config files).

###3. Develop
**You can now make edits and do development on the files in the src directory.** When ready to test, run the gulp watch command to view the app in the browser using a  lightweight node-js webserver environment.
```bash
gulp watch
```
This connection is live and will update automatically as changes are made to code. To execute other commands, you will need to escape the active webserver with `CTRL + C`

###4. Do a test build
When satisfied with your changes, test them in the build environment by running the build command. Currently, the base gulp command is configured to default to "gulp build".
```bash
gulp
```
This will create a build folder including minified and combined dependency libraries. Open the app from the build folder as a final test of your changes.

###5. Copy your changes back to the generator-wim repo
Copy content from your edited files into their counterparts in the local generator-wim repo. Files are located at `generator-wim/app/templates` and can be identified by the leading underscore in their names. E.g. "_index.html", "_core.js" and "_main.css"

###6. Commit changes, push to personal repo, submit pull request to USGS-WiM repo, and merge changes

---







## Some links for learning more about generator
####*please add more here as found*

**yeoman**
http://yeoman.io/authoring/
http://yeoman.io/codelab.html
this is the original post i read that got me thinking: https://csessig.wordpress.com/category/yeoman/

**gulp**
http://danhulton.com/2014/03/gulp-js-an-amazing-build-system/
http://ericlbarnes.com/setting-gulp-bower-bootstrap-sass-fontawesome/

**npm**
http://browsenpm.org/package.json

**bower**
http://bower.io/docs/creating-packages/


> Written with [StackEdit](https://stackedit.io/).