# CAJS - Component Architecture JavaScript

A compact JavaScript format for describing web applications built in frameworks such as Next.js, designed to be used with Large Language Models (LLMs).

## Usage

In a codebase: Add [STYLEGUIDE.md](STYLEGUIDE.md) to your code base, then use your IDE’s AI chat function to reference the file.

In an application such as claude.ai or ChatGPT: add [STYLEGUIDE.md](STYLEGUIDE.md) to your project.

## Roadmap

* Figure out how to make this work with ShadCN
* Create code that reads a CAJS object and then serves a functioning web application
  * Possibly rely on a working Next.js project to do this
* Create an IDE based on CAJS

## Why?

Creating a modern web application means setting up folder structures and boilerplate code. You can use an LLM to do this for you. But it drains tokens file by file, line by line.

Don’t make LLMs repeat the same things over and over again. CAJS expresses an entire application in one compact file.