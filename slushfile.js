/*
 * slush-cap-vue-generator
 * https://github.com/SpringLIAO/slush-cap-vue-generator
 *
 * Copyright (c) 2017, SpringLIAO
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    _ = require('underscore.string'),
    inquirer = require('inquirer'),
    path = require('path');

function format(string) {
    var username = string.toLowerCase();
    return username.replace(/\s/g, '');
}

var defaults = (function () {
    var workingDirName = path.basename(process.cwd()),
      homeDir, osUserName, configFile, user;

    if (process.platform === 'win32') {
        homeDir = process.env.USERPROFILE;
        osUserName = process.env.USERNAME || path.basename(homeDir).toLowerCase();
    }
    else {
        homeDir = process.env.HOME || process.env.HOMEPATH;
        osUserName = homeDir && homeDir.split('/').pop() || 'root';
    }

    configFile = path.join(homeDir, '.gitconfig');
    user = {};

    if (require('fs').existsSync(configFile)) {
        user = require('iniparser').parseSync(configFile).user;
    }

    return {
        appName: workingDirName,
        userName: osUserName || format(user.name || ''),
        authorName: user.name || '',
        authorEmail: user.email || ''
    };
})();

gulp.task('default', function (done) {
    var prompts = [{
        name: 'appName',
        message: 'What is the name of your project?',
        default: defaults.appName
    }, {
        name: 'appDescription',
        message: 'What is the description?'，
        default: 'you know what i mean.'
    }, {
        name: 'appVersion',
        message: 'What is the version of your project?',
        default: '0.1.0'
    }, {
        name: 'authorName',
        message: 'What is the author name?',
        default: defaults.authorName
    }, {
        name: 'authorEmail',
        message: 'What is the author email?',
        default: defaults.authorEmail
    }, {
        name: 'userName',
        message: 'What is the github username?',
        default: defaults.userName
    }, {
        type: 'confirm',
        name: 'unit',
        message: 'Setup unit tests with Karma + Mocha?',
        default: true
    }, {
        type: 'confirm',
        name: 'vuex',
        message: 'use vuex to manage your state?',
        default: true
    }, {
        type: 'confirm',
        name: 'router',
        message: 'use vue-router for SPA?',
        default: true
    }, {
        type: 'confirm',
        name: 'http',
        message: 'use vue-resource make web http requests and handle responses?',
        default: true
    }, {
        type: 'confirm',
        name: 'capUi',
        message: 'use cap-ui?',
        default: false
    }, {
        type: 'list',
        name: 'license',
        message: 'Choose your license type',
        choices: ['MIT', 'BSD'],
        default: 'MIT'
    }, {
        type: 'confirm',
        name: 'moveon',
        message: 'Continue?'
    }];
    //Ask
    inquirer.prompt(prompts,
        function (answers) {
            if (!answers.moveon) {
                return done();
            }
            answers.appNameSlug = _.slugify(answers.appName);
            var filesPath = [__dirname + '/template/**']
            if (!answers.unit) {
              filesPath = filesPath.concat([
                '!' + __dirname + '/template/test',
                '!' + __dirname + '/template/test/**'
              ])
            }
            if (!answers.vuex) {
              filesPath = filesPath.concat([
                '!' + __dirname + '/template/src/store',
                '!' + __dirname + '/template/src/store/**'
              ])
            }
            if (!answers.router) {
              filesPath = filesPath.concat([
                '!' + __dirname + '/template/src/router',
                '!' + __dirname + '/template/src/router/**'
              ])
            }
            if (!answers.http) {
              filesPath = filesPath.concat([
                '!' + __dirname + '/template/src/common/api.js'
              ])
            }
            gulp.src(filesPath, { dot : true })
                .pipe(template(answers))
                .pipe(rename(function (file) {
                    if (file.basename[0] === '_') {
                        file.basename = '.' + file.basename.slice(1);
                    }
                }))
                .pipe(conflict('./'))
                .pipe(gulp.dest('./'))
                .pipe(install())
                .on('end', function () {
                    done();
                });
        });
});
