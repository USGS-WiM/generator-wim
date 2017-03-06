'use strict';
var yeoman = require('yeoman-generator');
var mkdirp = require('mkdirp');
var yosay = require('yosay');
var chalk = require('chalk');
var slugify = require("underscore.string/slugify");
var glob = require('glob');

var WiMGenerator = class extends yeoman {
  
  // The name `constructor` is important here
  constructor(args,opts) {

    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    this.argument('appName', { type: String, required: false });
    this.argument('mappingAPI', { type: String, required: false });
  }

  initializing() {

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
      },
      {
        type: 'list',
        name: 'mappingFlavor',
        message: 'Choose your flavor:',
        choices: [
          'lite',
          'full'
        ]
      },
      {
        type: 'list',
        name: 'buildSystem',
        message: 'Choose your build system:',
        choices: [
          'gulp',
          'webpack'
        ]
      }]).then((answers) => {
        this.appName = answers.appName;
        this.mappingAPI = answers.mappingAPI;
        this.mappingFlavor = answers.mappingFlavor;
        this.buildSystem = answers.buildSystem;
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
    this.generatorPkg = require('../package.json');
    //this.templatePkg = require(this.templatePath('/package.json'));

    //create appConfig object
    this.appConfig = {
      generatorInfo: this.generatorPkg,
      //appInfo: this.templatePkg,
      mappingAPI: this.mappingAPI,
      appName: this.appName,
      buildSystem: this.buildSystem,
      slugifiedAppName: slugify(this.appName)
    };

    //first do full copy ignoring templated files
    this.fs.copy(this.templatePath(), this.destinationPath(), { globOptions: { dot: true, ignore: ['**/package.json','**/index.html','**/gulpfile.js','**/webpack.config.js','**/core.js']}});

    //then overwrite template files
    this.fs.copyTpl(this.templatePath('src/index.html'), this.destinationPath('src/index.html'), this.appConfig);
    this.fs.copyTpl(this.templatePath('package.json'), this.destinationPath('package.json'), this.appConfig);

    if (this.mappingFlavor == 'lite') {
      this.fs.copyTpl(this.templatePath('src/scripts/' + this.mappingAPI + '/core-lite.js'), this.destinationPath('src/scripts/core.js'), this.appConfig);
    }
    else {
      this.fs.copyTpl(this.templatePath('src/scripts/' + this.mappingAPI + '/core-full.js'), this.destinationPath('src/scripts/core.js'), this.appConfig);
    }

    if (this.buildSystem == 'gulp') {
      this.fs.copyTpl(this.templatePath('gulpfile.js'), this.destinationPath('gulpfile.js'), this.appConfig);
    }
    if (this.buildSystem == 'webpack') {
      this.fs.copyTpl(this.templatePath('webpack.config.js'), this.destinationPath('webpack.config.js'), this.appConfig);
    }
  }

  install() {
    this.npmInstall()
  }

};

module.exports = WiMGenerator;