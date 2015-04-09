# generator-wim 

> [Yeoman](http://yeoman.io) generator for scaffolding html5/javascript web mappinng apps.  Allows for use of [ESRI](https://developers.arcgis.com/javascript/) or [Leaflet](http://leafletjs.com/) as the mapping API.   It uses bower for dependency injection and gulp as its task runner.


## Getting Started

#### 1.  Fork this repo to your personal github account

#### 2.  Clone the repo from your personal github account to your computer

## Generator Setup

#### 1.  Install required software 
[node.js](http://nodejs.org)  
[github for windows](https://windows.github.com/)  

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
yo wim
```
#### 5.  Profit


## Some links for learning more about this process 
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