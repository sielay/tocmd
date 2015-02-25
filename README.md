to-cmd
======

> Table of Contents for your MD documentation. 

Why?
----

[Markdown](http://daringfireball.net/projects/markdown/) is already standard in the industry. There are number of various tools (mostly commercial) to give extra powers to MD. This simple liblary is meant to allow you add maintainless, hasslefree tables of contents and other indexing widgets to your project. Idea is that you can connect this lib to your build or versioning process to keep documentation navigation always up to date.
 

## Table of contents
<!-- TOCSTART(-1,true,true) -->
* [tocmd](./README.md#user-content-tocmd)
  * [Table of contents](./README.md#user-content-tableofcontents)
  * [Installation](./README.md#user-content-installation)
  * [Usage](./README.md#user-content-usage)
  * [Markup](./README.md#user-content-markup)
  * [TODO](./README.md#user-content-todo)

<!-- TOCEND -->

## Installation

```
npm install toc-md -g
```

## Usage

```
./tocmd -s /path/to/my/project
```

## Markup



By default comment bloci load 

<!-- NOTOC -->
	<!-- TOCSTART(-1,false,false) -->
	<!-- TOCEND -->
	<!-- TOCSTART(1,false,false) -->
	<!-- TOCEND --
	<!-- TOCSTART(1,true,false) -->
	<!-- TOCEND -->
	<!-- TOCSTART(1,true,true) -->
	<!-- TOCEND -->
<!-- NOTOC -->

## TODO

* Gulp task
* Grunt task
* Git hook
* Ignore node_modules
* Fix complex inner links

## Credits

Author [Lukasz Sielski](http://github.com/sielay). Hugely improved thanks to comments from [Patrick Polloni](https://github.com/kimu). Uses parser from amazing [Marked](https://github.com/chjj/marked) project.

