'use strict';

var fs         = require('fs'),
    glob       = require('glob'),
    path       = require('path'),
    marked     = require('marked'),
    lexer      = marked.lexer,
    repository = {},
    i = 0;

function crawl(dir) {
    var callback,
        withContent = false,
        sortFunction = null;
    if (typeof(arguments[1]) === 'function') {
        callback = arguments[1];
        sortFunction = arguments[2];
    } else {
        withContent = arguments[1];
        callback = arguments[2];
        sortFunction = arguments[3];
    }
    mapFiles(dir, function (error, list) {

        if (process.exclude) {
            var clean = [];
            list.forEach(function (item) {
                var pass = true;
                process.exclude.forEach(function (ex) {
                    if (item.indexOf(ex) === 0) {
                        pass = false;
                    }
                });
                if (pass) {
                    clean.push(item);
                }
            });
            list = clean;
        }

        if (error) {
            callback(error);
        }
        var fileList = [];
        list.forEach(function (file) {
            fileList.push(path.relative(dir, file));
        });
        callback(null, organise(parseFiles(fileList, withContent, dir + '/', sortFunction)));
    });
}

function fileRead(path) {
    i++;
    return fs.readFileSync(path, 'utf8')
}

function innerHeaders(file) {
    var abs = path.resolve(file),
        cache = repository[abs];
    if (cache) return cache;
    return (repository[abs] = organise(parseHeaders(fileRead(file))));
}

function mapFiles(dir, callback) {
    glob(dir + '/**/+(*.+(MD|md)|LICENSE|README|readme|license)', callback);
}

function parseHeader(line) {
    var parts = line.match(/^\s*(#+)(.+)$/);
    return {
        level: parts[1].length,
        label: parts[2].replace(/^\s+|\s+$/g, ''),
        items: []
    };
}

function parseHeaders(content) {

    var headers = [];
    lexer(content).forEach(function (token) {
        if (token.type === 'heading') {
            headers.push({
                level: token.depth,
                label: token.text,
                items: []
            })
        }
    });
    return headers;
}

function crawlForOrganise(list, parent, index) {
    var next = list[0];
    while (next) {
        if (next.level <= parent.level) { // sibling or parent, exit
            return parent;
        }
        list.shift(); // consume
        crawlForOrganise(list, next, ++index);
        parent.items.push(next);
        next = list[0];
    }
    return parent;
}

function organise(list) {
    return crawlForOrganise(list, {
        level: 0, items: []
    }, 0);
}

function parseFile(file, withContent, root) {

    var obj = {
        path : file,
        level: file.split('/').length,
        items: []
    };
    if (withContent) {
        obj.innerHeaders = innerHeaders(root + file);
    }
    return obj;
}

function sortValue(value) {
    var dirname = path.dirname(value);
    if (/index(|\.md)$/i.test(value)) return dirname + '/' + 0;
    if (/readme(|\.md)$/i.test(value)) return dirname + '/' + 1;
    return value;
}

function fileSortFunction(a, b) {
    var aV = sortValue(a),
        bV = sortValue(b);

    if (aV === bV) return 0;
    return aV < bV ? -1 : 1;
}

function parseFiles(filesList, withContent, root, sort) {
    filesList.sort(sort);
    var files = [];
    filesList.forEach(function (file) {
        files.push(parseFile(file, withContent, root));
    });
    return files;
}

module.exports = {
    crawl           : crawl,
    innerHeaders    : innerHeaders,
    parseHeader     : parseHeader,
    parseHeaders    : parseHeaders,
    organise        : organise,
    mapFiles        : mapFiles,
    parseFile       : parseFile,
    parseFiles      : parseFiles,
    fileSortFunction: fileSortFunction,
    report : function() {
        return i;
    }
};