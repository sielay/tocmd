'use strict';module.exports=[
    {
        "params": {
            "maxDepth": -1,
            "includeHeaders": false,
            "justHeaders": false,
            "original": false
        },
        "tag": "<!-- TOCSTART -->\n<!-- TOCEND -->"
    },
    {
        "params": {
            "maxDepth": -1,
            "includeHeaders": false,
            "justHeaders": false,
            "original": "3"
        },
        "tag": "<!-- TOCSTART(3) -->\ndsfasdfasdf\n<!-- TOCEND -->"
    },
    {
        "params": {
            "maxDepth": -1,
            "includeHeaders": true,
            "justHeaders": true,
            "original": "content,no-files"
        },
        "tag": "<!-- TOCSTART(content,no-files) -->\ndf\n\ndfasd\nf a\nfads\ndfasd <\ndfs <!-- dfdff -->\n>\n<!-- TOCEND -->"
    },
    {
        "params": {
            "maxDepth": -1,
            "includeHeaders": true,
            "justHeaders": false,
            "original": "134,content"
        },
        "tag": "<!-- TOCSTART(134,content) -->\n<!-- TOCEND -->"
    },
    {
        "params": {
            "maxDepth": -1,
            "includeHeaders": true,
            "justHeaders": true,
            "original": "-1,content,no-files"
        },
        "tag": "<!-- TOCSTART(-1,content,no-files) -->\n<!-- TOCEND -->"
    },
    {
        "params": {
            "maxDepth": -1,
            "includeHeaders": true,
            "justHeaders": false,
            "original": "-1,content"
        },
        "tag": "<!-- TOCSTART(-1,content) -->\n<!-- TOCEND -->"
    },
    {
        "params": {
            "maxDepth": -1,
            "includeHeaders": true,
            "justHeaders": true,
            "original": "-1,content, no-files"
        },
        "tag": "<!-- TOCSTART(-1,content, no-files) -->\n<!-- TOCEND -->"
    }
];