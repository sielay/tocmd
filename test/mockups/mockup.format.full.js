'use strict';

module.exports = [{path: 'mockups/README.MD', items: [], title: 'tocmd', depth: 1},
    {
        path : 'mockups/LICENSE',
        items: [{
            path : 'mockups/doc/myfiles/INDEX.MD',
            items: [],
            title: 'INDEX.MD',
            depth: 2
        },
            {
                path : 'mockups/doc/myfiles/README',
                items: [],
                title: 'README',
                depth: 2
            },
            {
                path : 'mockups/doc/myfiles/COMPLEX_HEADERS.md',
                items: [{
                    path : 'mockups/doc/myfiles/COMPLEX_HEADERS.md#user-content-header211',
                    title: 'Header 2 1.1',
                    items: [{
                        path : 'mockups/doc/myfiles/COMPLEX_HEADERS.md#user-content-header3111',
                        title: 'Header 3 1.1.1',
                        items: [],
                        depth: 4
                    }],
                    depth: 3
                },
                    {
                        path : 'mockups/doc/myfiles/COMPLEX_HEADERS.md#user-content-header212',
                        title: 'Header 2 1.2',
                        items: [{
                            path : 'mockups/doc/myfiles/COMPLEX_HEADERS.md#user-content-header4121',
                            title: 'Header 4 1.2.1',
                            items: [],
                            depth: 4
                        }],
                        depth: 3
                    }],
                title: 'Header 1 1',
                depth: 2
            },
            {
                path : 'mockups/doc/myfiles/OTHER.MD',
                items: [],
                title: 'OTHER.MD',
                depth: 2
            },
            {
                path : 'mockups/doc/myfiles/SOME.MD',
                items: [{
                    path : 'mockups/doc/myfiles/other/readme',
                    items: [],
                    title: 'readme',
                    depth: 3
                },
                    {
                        path : 'mockups/doc/myfiles/other/ANY.MD',
                        items: [],
                        title: 'ANY.MD',
                        depth: 3
                    },
                    {
                        path : 'mockups/doc/myfiles/other/INNER.MD',
                        items: [{
                            path : 'mockups/doc/myfiles/other/inner/INDEX.MD',
                            items: [],
                            title: 'INDEX.MD',
                            depth: 4
                        }],
                        title: 'INNER.MD',
                        depth: 3
                    }],
                title: 'Some',
                depth: 2
            }],
        title: 'LICENSE',
        depth: 1
    }];