![WiM](wimlogo.png)

# generator-wim

[Yeoman](http://yeoman.io) generator for scaffolding html5/javascript web mappinng apps.  Allows for use of [ESRI](https://developers.arcgis.com/javascript/) or [Leaflet](http://leafletjs.com/) as the mapping API.   It uses npm for dependency injection and gulp as its task runner.

### Prerequisites

[Node Package Manager (npm)](https://www.npmjs.com/)
[git](https://windows.github.com/)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

#### 1.  Install required software (see Prerequisites above before proceeding)

#### 2.  Install yeoman
This will install the following packages globally (to your "C:\Users\%user%\AppData\Roaming\npm\node_modules" folder.)  This can be done from any command prompt

```bash
npm install -g yo
```

#### 3.  Clone 'generator-wim' repo
Create a local copy of the generator

```bash
git clone https://github.com/USGS-WiM/generator-wim.git
```

#### 4.  Create symbolic link for generator-wim inside the generator-wim folder
This 'tricks' node into thinking your generator-wim is a globally installed node module in this location: "C:\Users\%user%\AppData\Roaming\npm\node_modules"

```bash
cd generator-wim
npm install
npm link
```

#### 5.  Run the generator to create a new app
Create a new folder for the generated app and run the generator

```bash
md new-app
cd new-app
yo wim
```

## Updating the generator source and dependencies

#### 1.  Get latest code from github
```bash
cd generator-wim
git pull origin master
```
#### 2.  Update dependencies
```bash
npm update
```

---
## Editing the generator itself
The process described below is for making edits to the actual generator code, i.e. the source from which all generated apps will be generated. Exercise caution, as these edits will affect all future generations.

###1. Ensure that your local repo of generator-wim is up-to-date
run a pull  from the upstream at your local repo directory to retrieve latest from the org repo at [USGS-WiM/generator-wim](https://github.com/USGS-WiM/generator-wim).
```bash
cd generator-wim
git pull origin master
```

If you have conflicts after you pull the latest code, it is recommended to install and configure a windows mergetool for git.   [p4merge](http://www.perforce.com/product/components/perforce-visual-merge-and-diff-tools) seems to work OK.  [Here is some help](https://www.perforce.com/perforce/doc.current/manuals/p4v/merging_files.html) on using it to compare diffs from git.  The commands to set it up with git:
```bash
git config --global merge.tool p4merge
git config --global mergetool.p4merge.cmd "C:\\Users\\%username%\\Perforce\\p4merge.exe \"$BASE\" \"$LOCAL\"
\"$REMOTE\" \"$MERGED\""
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
follow the prompts, and eventually you will have app code in your dev directory, whose contents should now contain the follwoing files:
```bash
node_modules src .gitignore .jshintrc gulpfile.js package.json
```

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

###5. Create a new branch in 'generator-wim'
Create a new branch of the cloned repo that will contain your changes
```bash
git checkout -b 'branch-name'
```

###6. Copy changes from test instance back to the generator-wim repo
Copy content from your edited files into their counterparts in the local generator-wim repo. Files are located at `generator-wim/app/templates` and can be identified by the leading underscore in their names. E.g. "_index.html", "_core.js" and "_main.css"

###7. Submit new branch back to USGS-WiM 'generator-wim' repo
```bash
git add .
git commit -m 'message describing your updates'
git push origin 'new_branch_name'
```

## Built With

* [Yeoman](https://angular.io/) - generator for scaffolding html5/javascript web mappinng apps.
* [ESRI](https://developers.arcgis.com/javascript/) - Mapping API option.
* [Leaflet](http://leafletjs.com/) Mapping API option.
* [NPM](https://www.npmjs.com/) - Dependency Management
* [Others](https://www.npmjs.com/) - Any other high-level dependencies

## Contributing

Please read [CONTRIBUTING.md]() for details on the process for submitting pull requests to us. Please read [CODE_OF_CONDUCT.md]() for details on adhering by the [USGS Code of Scientific Conduct](https://www2.usgs.gov/fsp/fsp_code_of_scientific_conduct.asp).

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

Advance the version when adding features, fixing bugs or making minor enhancement. Follow semver principles. To add tag in git, type git tag v{major}.{minor}.{patch}. Example: git tag v2.0.5

To push tags to remote origin: `git push origin --tags`

*Note that your alias for the remote origin may differ.

## Authors

* **[Martyn Smith](https://www.usgs.gov/staff-profiles/martyn-smith)**  - *Lead Developer* - [USGS Web Informatics & Mapping](https://wim.usgs.gov/)
* **[Nicholas Estes](https://www.usgs.gov/staff-profiles/nicholas-j-estes)**  - *Developer* - [USGS Web Informatics & Mapping](https://wim.usgs.gov/)
* **[Blake Draper](https://www.usgs.gov/staff-profiles/blake-a-draper)**  - *Developer* - [USGS Web Informatics & Mapping](https://wim.usgs.gov/)

See also the list of [contributors](https://github.com/USGS-WiM/generator-wim/graphs/contributors) who participated in this project.

## License

This project is licensed under the Creative Commons CC0 1.0 Universal License - see the [LICENSE.md](LICENSE.md) file for details

## Suggested Citation
In the spirit of open source, please cite any re-use of the source code stored in this repository. Below is the suggested citation:

`This project contains code produced by the Web Informatics and Mapping (WIM) team at the United States Geological Survey (USGS). As a work of the United States Government, this project is in the public domain within the United States. https://wim.usgs.gov`


## Acknowledgments

* Hat tip to anyone who's code was used
* Inspiration Note 

## About WIM
* This project authored by the [USGS WIM team](https://wim.usgs.gov)
* WIM is a team of developers and technologists who build and manage tools, software, web services, and databases to support USGS science and other federal government cooperators.
* WiM is a part of the [Upper Midwest Water Science Center](https://www.usgs.gov/centers/wisconsin-water-science-center).
