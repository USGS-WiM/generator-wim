'use strict';
var yeoman = require('yeoman-generator');
var mkdirp = require('mkdirp')
var yosay = require('yosay');
var chalk = require('chalk');
var slugify = require("underscore.string/slugify");

var WiMGenerator = class extends yeoman {
  
  // The name `constructor` is important here
  constructor(args,opts) {

    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    this.argument('appName', { type: String, required: false });
    this.argument('mappingAPI', { type: String, required: false });
  }

  initializing() {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies({
          callback : function(){
            this.emit('depsInstalled');
          }.bind(this)
        });
      }
    });
    
    this.on('depsInstalled', function(){
      //can do something here if needed
    }.bind(this));
  }

  prompting() {
    var welcomeMsg =  '\n   __      __.__   _____   ' +
                      '\n  /  \\    /  \\__| /     \\  ' +
                      '\n  \\   \\/\\/   /  |/  \\ /  \\ ' + 
                      '\n   \\        /|  /    Y    \\' +
                      '\n    \\__/\\  / |__\\____|__  /' +
                      '\n         \\/             \\/ ' +
                      '\n';


    // have Yeoman greet the user
    this.log(chalk.green(welcomeMsg));
    
    if ((this.options.env.cwd).indexOf('generator-wim') != -1) {
      this.log(chalk.yellow('yo you need to chill. (looks like you are trying to generate an app in the generator-wim repo. Pick a different directory, playa)'));
      return;
    }

    // replace it with a short and sweet description of your generator
    this.log(yosay(chalk.magenta('You\'re using the fantastic WiM generator v2.')));

    //check for command line arguments
    if ((!this.options.appName) && (!this.options.mappingAPI)) {
      return this.prompt([{
        type    : 'input',
        name: 'appName',
        message: 'What\'s the name of your application?',
        default: 'Map application'
      }, {
        type: 'list',
        name: 'mappingAPI',
        message: 'Choose your mapping API:',
        choices: [
          'leaflet',
          'esri'
        ]
      }]).then((answers) => {
        this.appName = answers.appName;
        this.mappingAPI = answers.mappingAPI;
      });
    }
    else {
      this.appName = this.options.appName;
      this.mappingAPI = this.options.mappingAPI;
      this.log(chalk.blue('You chose the application name:'), chalk.red(this.appName));
      this.log(chalk.blue('You chose the mapping API:'), chalk.red(this.mappingAPI));
    }
  }

  writing() {
    //create appConfig object
    this.appConfig = {
      generatorInfo: this.pkg,
      mappingAPI: this.mappingAPI,
      appName: this.appName,
      slugifiedAppName: slugify(this.appName)
    }

    //create folders we need
    mkdirp('src');
    mkdirp('src/styles');
    mkdirp('src/scripts');

    //just copy these files over and rename
    this.fs.copy(this.templatePath('_main.css'), this.destinationPath('src/styles/main.css'));
    this.fs.copy(this.templatePath('images/'), this.destinationPath('src/images/'));
    this.fs.copy(this.templatePath('_.gitignore'), this.destinationPath('.gitignore'));
    this.fs.copy(this.templatePath('_.jshintrc'), this.destinationPath('.jshintrc'));

    //copyTpl is used for copying files with template variables passed in
    this.fs.copyTpl(this.templatePath('_index.html'), this.destinationPath('src/index.html'), this.appConfig);
    this.fs.copyTpl(this.templatePath('_gulpfile.js'), this.destinationPath('gulpfile.js'), this.appConfig);
    this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json'), this.appConfig);

    // mapping API specific resources
    var sourceDir = 'map-' + this.mappingAPI;
    this.fs.copy(this.templatePath(sourceDir + '/_core.js'), this.destinationPath('src/scripts/core.js'));
    this.fs.copy(this.templatePath(sourceDir + '/_layers.js'), this.destinationPath('src/scripts/layers.js'));
    this.fs.copy(this.templatePath(sourceDir + '/_utilities.js'), this.destinationPath('src/scripts/utilities.js'));

  }

  install() {
    this.npmInstall()
  }

};

module.exports = WiMGenerator;