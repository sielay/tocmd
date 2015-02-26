'use strict';

var collector = require('./collector'),
    formatter = require('./formatter'),
    eachAsync = require('each-async'),
    fs        = require('fs'),
    path      = require('path'),
    PHP_EOL   = require('os').EOL,
    chalk     = require('chalk');

function parse(content) {
    var reg = /\^<\!--\s*TOCSTART(|\(.*?\))\s*--\>([\s\S]*?)\<\!--\s*TOCEND\s*-->/g,
        regOne = /\<\!--\s*TOCSTART(|\((.*?)\))\s*--\>([\s\S]*?)\<\!--\s*TOCEND\s*-->/,
        matches = content.match(reg),
        results = [];
    if (!matches) return results;
    matches.forEach(function (match) {
        var parts = match.match(regOne);
        var params = parts[2] ? parts[2].split(',') : '';
        var maxDepth = ( params[0] === 'true' || !params[0] ) ? -1 : parseInt(params[0]);
        var includeHeaders = params[1] === 'true' ? true : false;
        var justHeaders = params[2] === 'true' ? true : false;
        results.push({
            params: {
                maxDepth      : maxDepth,
                includeHeaders: includeHeaders,
                justHeaders   : justHeaders
            },
            tag   : match
        });
    });
    return results;
}

function build(content, file, root, callback) {

    eachAsync(parse(content), function (tag, index, done) {

        var replacement = null;

        var next = function () {
            content = content.replace(tag.tag, '<!-- TOCSTART(' +
            tag.params.maxDepth + ',' +
            (tag.params.includeHeaders ? 'true' : 'false') + ',' +
            (tag.params.justHeaders ? 'true' : 'false') +
            ') -->' + PHP_EOL + formatter.formatMD(replacement) + PHP_EOL + '<!-- TOCEND -->');
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
    if (process.verbose === true) {
        console.log(chalk.blue('buildDocCrawl ') + ': ' + chalk.yellow(item.path));
    }
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
    if (process.verbose === true) {
        console.log(chalk.blue('buildDoc ') + ': ' + chalk.yellow(root));
    }
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