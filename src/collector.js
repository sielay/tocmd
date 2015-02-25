'use strict';

var fs   = require('fs'),
    glob = require('glob'),
    path = require('path');

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

function innerHeaders(file) {
    return organise(parseHeaders(extractHeaders(fs.readFileSync(file, 'utf8'))))
}

function mapFiles(dir, callback) {
    glob(dir + '/**/+(*.+(MD|md)|LICENSE|README|readme|license)', callback);
}

function fetch(files) {
    files.forEach(function (file) {
        var content = fs.readFileSync(file, 'utf8');
        extractHeaders(content);
    });
}

function extractHeaders(content) {
    var headers = [];
    content.split(/\n|\n\r|\r/g).forEach(function (line) {
        if (line.match(/^\s*(#+)/)) {
            headers.push(line);
        }
    });
    return headers;
}

function parseHeader(line) {
    var parts = line.match(/^\s*(#+)(.+)$/);
    return {
        level: parts[1].length,
        label: parts[2].replace(/^\s+|\s+$/g, ''),
        items: []
    };
}

function parseHeaders(lines) {
    var headers = [];
    lines.forEach(function (line) {
        headers.push(parseHeader(line));
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
    extractHeaders  : extractHeaders,
    parseHeader     : parseHeader,
    parseHeaders    : parseHeaders,
    organise        : organise,
    mapFiles        : mapFiles,
    parseFile       : parseFile,
    parseFiles      : parseFiles,
    fetch           : fetch,
    fileSortFunction: fileSortFunction
};