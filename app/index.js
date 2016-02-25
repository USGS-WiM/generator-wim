'use strict';
var util = require('util'),
  path = require('path'),
  yeoman = require('yeoman-generator'),
  chalk = require('chalk'),
  fse = require('fs-extra');



 
var WiMGenerator = yeoman.generators.Base.extend({
  
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('appName', { type: String, required: false });
    this.argument('mappingAPI', { type: String, required: false });
  },
  
  init: function () {
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
  },

  promptUser: function () {
    var done = this.async();

    // have Yeoman greet the user
    this.log(this.WiMWelcome());
    
    if ((this.options.env.cwd).indexOf('generator-wim') != -1) {
      this.log('yo you need to chill. (looks like you are trying to generate an app in the generator-wim repo. Pick a different directory, playa)');
      return;
    }

    // replace it with a short and sweet description of your generator
    this.log(chalk.magenta('You\'re using the fantastic WiM generator.'));

    var prompts = [{
      name: 'appName',
      message: 'What\'s the name of your application?',
      default: 'Map application'
    },{
      type: 'list',
      name: 'mappingAPI',
      message: 'Choose your mapping API:',
      choices: [
        'esri',
        'leaflet'
      ]
    }];

    if ((!this.appName) && (!this.mappingAPI)) {
      this.prompt(prompts, function (props) {
        this.appName = props.appName;
        this.mappingAPI = props.mappingAPI;

        done();
      }.bind(this));
    }
    else {
      done();
    }
  },

  src: function () {
  
	//set up folder structure
    this.mkdir('src');
    this.mkdir('src/styles');
    this.mkdir('src/less');
    this.mkdir('src/scripts');
    this.mkdir('src/images');
    this.template('gulpfile.js', 'gulpfile.js');
    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
  },

  projectfiles: function () {

    // template specific resources
    var sourceDir = 'map-' + this.mappingAPI;
    this.copy(sourceDir + '/_core.js', 'src/scripts/core.js');
    this.copy(sourceDir + '/_layers.js', 'src/scripts/layers.js');
    this.copy(sourceDir + "/_utilities.js", 'src/scripts/utilities.js');
    this.copy('_index.html', 'src/index.html');
    this.copy('_main.css', 'src/styles/main.css');
    this.directory('/images/', 'src/images/');
    this.copy('bowerrc', '.bowerrc');
    this.copy('gitignore', '.gitignore');
    this.copy('jshintrc', '.jshintrc');

  }, 

  WiMWelcome : function(){
    return  '\n   __      __.__   _____   ' +
            '\n  /  \\    /  \\__| /     \\  ' +
            '\n  \\   \\/\\/   /  |/  \\ /  \\ ' + 
            '\n   \\        /|  /    Y    \\' +
            '\n    \\__/\\  / |__\\____|__  /' +
            '\n         \\/             \\/ ' +
            '\n';
  }
});

module.exports = WiMGenerator;