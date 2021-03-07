'use strict';

// Inspired by: https://github.com/commitizen/cz-conventional-changelog and https://github.com/commitizen/cz-cli

var CZ_CONFIG_NAME = '.cz-config.js';
var CZ_CONFIG_EXAMPLE_LOCATION = './cz-config-EXAMPLE.js';
var findConfig = require('find-config');
var log = require('winston');
var editor = require('editor');
var temp = require('temp').track();
var fs = require('fs');
var path = require('path');
var buildCommit = require('./buildCommit');
var colors = require('colors/safe');


/* istanbul ignore next */
function readConfigFile() {

  // First try to find config block in the nearest package.json
  var pkg = findConfig.require('package.json', {home: false});
  if (pkg) {
    if (pkg.config && pkg.config['cz-customizable'] && pkg.config['cz-customizable'].config) {
      var pkgPath = path.resolve(pkg.config['cz-customizable'].config);

      console.info('>>> Using config ' + colors.green(pkgPath) + ' specified in your package.json');

      return require(pkgPath);
    }
  }

  console.log(colors.yellow('Unable to find a configuration file. Please refer to documentation to learn how to set up: https://github.com/leonardoanalista/cz-customizable#steps "'));
}

function readAuditors() {
    var username = require('git-user-name');
    var gitUsername = username({path: '.git/config'}) || username();
    console.log('>>> Git username: ' + colors.green(gitUsername));
    if (!gitUsername) {
      console.log(colors.red('\nCan NOT get the git username. use \'git config (--global) user.name "yourname"\' to set it\n'));
        throw new Error();
    }

    var pkg = findConfig.require('package.json', {home: false});
    if (pkg) {
        if (pkg.config && pkg.config['cz-customizable'] && pkg.config['cz-customizable'].auditors) {
            var pkgPath = path.resolve(pkg.config['cz-customizable'].auditors);

            try {
                if (!require(pkgPath)[gitUsername]) {
                  console.log(colors.yellow('>>> You set a Auditors file config but the your username does NOT in it.\n' +
                    '    I will try to read the repoAuditors.json file.'));
                } else {
                  return require(pkgPath)[gitUsername];
                }
            } catch(err) {
                console.info(colors.yellow('>>> You set a Auditors file config but the file does NOT exit.\n' +
                    '    I will try to read the repoAuditors.json file.'));
            }
        }
    }

    var defaultAuditors = findConfig.require('repoAuditors.json', {home: false});

    if (defaultAuditors && defaultAuditors[gitUsername] && defaultAuditors[gitUsername].length) {
        return defaultAuditors[gitUsername];
    }

    console.info(colors.yellow('>>> Unable to find a Auditors config finally.'));
}

module.exports = {

  prompter: function(cz, commit) {
    var config = readConfigFile();
    var auditorsConfig = readAuditors();
    if (config.forceAuditors && !auditorsConfig) {
        console.log(colors.red('\nThe repo force set your Auditors, but I can NOT reach it. Please check.\n'));
        throw new Error();
    }
    config.auditors = auditorsConfig;

    //log.info('\n\nLine 1 will be cropped at 100 characters. All other lines will be wrapped after 100 characters.\n');
    console.log();

    var questions = require('./questions').getQuestions(config, cz);

    cz.prompt(questions).then(function(answers) {

      if (answers.confirmCommit === 'edit') {
        temp.open(null, function(err, info) {
          /* istanbul ignore else */
          if (!err) {
            fs.write(info.fd, buildCommit(answers, config.auditors));
            fs.close(info.fd, function(err) {
              editor(info.path, function (code, sig) {
                if (code === 0) {
                  var commitStr = fs.readFileSync(info.path, { encoding: 'utf8' });
                  commit(commitStr);
                } else {
                  log.info('Editor returned non zero value. Commit message was:\n' + buildCommit(answers, config.auditors));
                }
              });
            });
          }
        });
      } else if (answers.confirmCommit === 'yes') {
        commit(buildCommit(answers, config.auditors));
      } else {
        log.info('Commit has been canceled.');
      }
    });
  }
};
