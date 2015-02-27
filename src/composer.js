'use strict';

var collector = require('./collector'),
    formatter = require('./formatter'),
    eachAsync = require('each-async'),
    fs        = require('fs'),
    path      = require('path'),
    PHP_EOL   = require('os').EOL,
    chalk     = require('chalk');

function parse(content) {
    if (process.verbose === true) console.log(chalk.blue('composer.parse '));

    var reg = /^\<\!--\s*TOCSTART(|\(.*?\))\s*--\>([\s\S]*?)\<\!--\s*TOCEND\s*-->/gm,
        regOne = /^\<\!--\s*TOCSTART(|\((.*?)\))\s*--\>([\s\S]*?)\<\!--\s*TOCEND\s*-->/,
        matches = content.match(reg),
        results = [];

    if (!matches) return results;


    matches.forEach(function (match) {
        var parts = match.match(regOne);
        var params = parts[2] ? parts[2].split(',') : '';

        if(params.indexOf('true') > -1 || params.indexOf('false') > -1 ) {
            throw new Error('Boolean params are not longer supported');
        }

        var maxDepth = (!params[0] || isNaN(+params[0])) ? -1 : +params[0];
        var includeHeaders = params.indexOf('content') > -1;
        var justHeaders = params.indexOf('no-files') > -1;

        results.push({
            params: {
                maxDepth      : maxDepth,
                includeHeaders: includeHeaders,
                justHeaders   : justHeaders,
                original : parts[2] || false
            },
            tag   : match
        });
    });
    return results;
}

function build(content, file, root, callback) {
    if (process.verbose === true) console.log(chalk.blue('composer.build ') + ': ' + chalk.yellow(file));

    eachAsync(parse(content), function (tag, index, done) {

        var replacement = null;

        var next = function () {
            var repl = '<!-- TOCSTART';
            if(tag.params.original) {
                repl += '(' + tag.params.original + ')';
            }
            repl += ' -->' + PHP_EOL + formatter.formatMD(replacement) + PHP_EOL + '<!-- TOCEND -->'
            content = content.replace(tag.tag, repl);
            done();
        };


        if (tag.params.justHeaders) {
            replacement = formatter.linkize(collector.organise(collector.parseHeaders(content)), null, null, file);
            return next();
        }

        collector.crawl(root, tag.params.includeHeaders, function (error, files) {
            if (error) {
                return callback(error);
            }
            replacement = formatter.linkize(files, {
                maxDepth: tag.params.maxDepth
            });
            next();
        });
    }, function (error) {
        callback(error, content);
    });

}

function buildFile(file, callback) {
    if (process.verbose === true) console.log(chalk.blue('composer.buildFile ') + ': ' + chalk.yellow(file));

    fs.readFile(file, 'utf8', function (error, content) {
        if (error) {
            return callback(error);
        }
        build(content, file, path.dirname(file), function (error, content) {
            if (error) {
                return callback(error);
            }
            fs.writeFile(file, content, 'utf8', callback);
        });

    });
}

function buildDocCrawl(root, item, callback) {
    if (process.verbose === true) console.log(chalk.blue('composer.buildDocCrawl ') + ': ' + chalk.yellow(item.path));

    if (!item || !item.items) {
        return callback();
    }
    eachAsync(item.items, function (file, index, next) {
        buildFile(root + '/' + file.path, function (error) {
            if (error) {
                return callback(error);
            }
            buildDocCrawl(root, file, next)
        });
    }, function (error) {
        callback(error);
    });
}

function buildDoc(root, done, exclude) {
    if (process.verbose === true) console.log(chalk.blue('composer.buildDoc ') + ': ' + chalk.yellow(root));

    collector.crawl(root, function (error, files) {
        if (error) {
            return done(error);
        }
        buildDocCrawl(root, files, done);
    }, null, exclude);
}

module.exports = {
    parse    : parse,
    build    : build,
    buildFile: buildFile,
    buildDoc : buildDoc
};