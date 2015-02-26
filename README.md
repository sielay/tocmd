to-cmd
======

> Table of Contents for your MD documentation. 

## Table of contents

<!-- TOCSTART(-1,content,no-files) -->
* [to-cmd](./README.md#user-content-tocmd)
  * [Table of contents](./README.md#user-content-table-of-contents)
  * [Why?](./README.md#user-content-why)
  * [Features](./README.md#user-content-features)
  * [Installation](./README.md#user-content-installation)
  * [Usage](./README.md#user-content-usage)
  * [Markup](./README.md#user-content-markup)
  * [TODO](./README.md#user-content-todo)
  * [Credits](./README.md#user-content-credits)

<!-- TOCEND -->


Why?
----

[Markdown](http://daringfireball.net/projects/markdown/) is already standard in the industry. There are number of various tools (mostly commercial) to give extra powers to MD. This simple liblary is meant to allow you add maintainless, hasslefree tables of contents and other indexing widgets to your project. Idea is that you can connect this lib to your build or versioning process to keep documentation navigation always up to date.

There are similar projects (listed below), but so far none of them address file tree:
 * https://www.npmjs.com/package/marked-toc
 * https://www.npmjs.com/package/md2toc
 * https://www.npmjs.com/package/markdown-toc
 * https://www.npmjs.com/package/md-toc
 
If you find features that would make this package better, or you know better open package, please let me know.

## Features
 * List headers in file
 * List files in project
 * Ignore paths (`node_modules` by default)
 * Ignore tags in `tab` code blocks


## Installation

```
npm install toc-md-files -g
```

## Usage

```
./tocmd -s /path/to/my/project
```

## Markup


By default comment bloci load 

	<!-- TOCSTART(-1,false,false) -->
    <!-- TOCEND -->
	<!-- TOCSTART(1,false,false) -->
	<!-- TOCEND -->
	<!-- TOCSTART(1,true,true) -->
    <!-- TOCEND -->

Params:
 * max depth, if -1 - unlimited 
 * show in file headers
 * show file tree

## TODO

* Gulp task
* Grunt task
* Git hook
* Ignore node_modules
* Fix complex inner links

## Credits

Author [Lukasz Sielski](http://github.com/sielay). Hugely improved thanks to comments from [Patrick Polloni](https://github.com/kimu). Uses parser from amazing [Marked](https://github.com/chjj/marked) project.

