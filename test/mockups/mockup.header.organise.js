'use strict';

module.exports = {
    level: 0,
    items: [
        {
            level: 1,
            label: 'Header 1 1',
            items: [
                {
                    level: 2,
                    label: 'Header 2 1.1',
                    items: [
                        {
                            level: 3, label: 'Header 3 1.1.1', items: []
                        }
                    ]
                },
                {
                    level: 2,
                    label: 'Header 2 1.2',
                    items: [
                        {
                            level: 4, label: 'Header 4 1.2.1', items: []
                        }
                    ]
                }
            ]
        },
        {
            level: 1, label: 'Header 1 2', items: []
        }
    ]
};