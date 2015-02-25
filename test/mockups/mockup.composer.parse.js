'use strict';

module.exports = [{
    params: {maxDepth: -1, includeHeaders: false, justHeaders: false},
    tag   : '<!-- TOCSTART -->\n<!-- TOCEND -->'
},
    {
        params: {maxDepth: 3, includeHeaders: false, justHeaders: false},
        tag   : '<!-- TOCSTART(3) -->\ndsfasdfasdf\n<!-- TOCEND -->'
    },
    {
        params: {maxDepth: -1, includeHeaders: true, justHeaders: false},
        tag   : '<!-- TOCSTART(true,true) -->\ndf\n\ndfasd\nf a\nfads\ndfasd <\ndfs <!-- dfdff -->\n>\n<!-- TOCEND -->'
    },
    {
        params: {maxDepth: 134, includeHeaders: true, justHeaders: false},
        tag   : '<!-- TOCSTART(134,true) -->\n<!-- TOCEND -->'
    },
    {
        params: {maxDepth: -1, includeHeaders: true, justHeaders: true},
        tag   : '<!-- TOCSTART(-1,true,true) -->\n<!-- TOCEND -->'
    }]
;