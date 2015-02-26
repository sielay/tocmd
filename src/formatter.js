'use strict';

var path    = require('path'),
    chalk   = require('chalk'),
    _       = require('lodash'),
    PHP_EOL = require('os').EOL;

function findHighestHeader(headers) {
    if (!headers) return false;
    if (headers.label && headers.label !== '') {
        return headers.label;
    }
    for (var i = 0; i < headers.items.length; i++) {
        var item = headers.items[i];
        var title = findHighestHeader(item);
        if (title) {
            return title;
        }
    }
    return false;
}

function makeLinkFromFile(file, options, depth) {
    var list = [], headers = [];
    if (file && file.innerHeaders && file.innerHeaders.items[0]) {
        headers = linkize(file.innerHeaders.items[0], options, depth, file.path);
    }
    var items = headers.concat(linkize(file, options, depth));
    var title = findHighestHeader(file.innerHeaders) || path.basename(file.path, 'md');
    return {
        path : file.path,
        items: items,
        title: title,
        depth: depth
    };
}

function hashHeader(header) {
    return 'user-content-' + header.toLowerCase().replace(/[^a-z0-9\s\t]+/g, '').replace(/[\s\t ]+/g,'-');
}

function makeLinkFromHeader(header, options, depth, inFile) {
    return {
        path : inFile + '#' + hashHeader(header.label),
        title: header.label,
        items: linkize(header, options, depth, inFile),
        depth: depth
    };
}

function linkizeCrawl(tree, list, options, depth, inFile) {
    if (options && options.maxDepth > 0 && options.maxDepth <= depth) {
        return list;
    }
    tree.items.forEach(function (file) {
        if (inFile) {
            var h = makeLinkFromHeader(file, options, depth + 1, inFile);
            return list.push(h);
        }
        list.push(makeLinkFromFile(file, options, depth + 1));
    });
    return list;
}

function linkize(tree, options, depth, inFile) {
    var depth = depth || 0;
    return linkizeCrawl(tree, [], options, depth, inFile);
}

function formatCLI(links, indent, logger) {
    if (!logger) {
        logger = console;
    }
    if (!indent) {
        indent = 0;
    }
    links.forEach(function (link) {
        var ind = '';
        for (var i = 0; i < indent; i++) ind += '  ';
        logger.log(ind + link.title + ' ' + chalk.blue('(' + link.path + ')'));
        formatCLI(link.items, indent + 1, logger);
    })
}

function formatMD(links, indent) {
    var str = '';
    if (!indent) {
        indent = 0;
    }
    links.forEach(function (link) {
        var ind = '';
        for (var i = 0; i < indent; i++) ind += '  ';
        str += (ind + '* [' + link.title + '](' + link.path + ')' + PHP_EOL);
        str += formatMD(link.items, indent + 1);
    });
    return str;
}

module.exports = {
    linkize  : linkize,
    formatCLI: formatCLI,
    formatMD : formatMD,
    hashHeader: hashHeader
};