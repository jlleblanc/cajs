# CAJS Configuration Style Guide v2

## Table of Contents
- [CAJS Configuration Style Guide v2](#cajs-configuration-style-guide-v2)
  - [Table of Contents](#table-of-contents)
  - [1. Introduction](#1-introduction)
  - [2. Project Structure](#2-project-structure)
  - [3. Meta Information](#3-meta-information)
  - [4. Page Definitions](#4-page-definitions)
  - [5. Component Definitions](#5-component-definitions)
    - [5.1 Using Pre-built Components](#51-using-pre-built-components)
    - [5.2 Component Composition Rules](#52-component-composition-rules)
  - [6. API Route Definitions](#6-api-route-definitions)
  - [7. State Management](#7-state-management)
  - [8. Styling](#8-styling)
  - [9. Internationalization](#9-internationalization)
  - [10. Markdown Content](#10-markdown-content)
  - [11. Naming Conventions](#11-naming-conventions)
  - [12. Best Practices](#12-best-practices)

## 1. Introduction

This style guide outlines the conventions for creating and maintaining a CAJS (Component Architecture JavaScript) configuration for component-based applications. It provides a consistent, readable, and maintainable structure for application configurations.

## 2. Project Structure

The top-level structure of the configuration object should include these keys:

```javascript
const appConfig = {
  meta: {},           // Project-wide configurations
  pages: {},          // Page/route definitions
  components: {},     // Component definitions
  api: {},           // API route definitions
  state: {},         // Global state management
  styles: {},        // Custom styling configurations (optional)
  i18n: {},          // Internationalization settings (optional)
  markdown: {},      // Markdown content
  primaryColor: "",   // Primary theme color
  secondaryColor: "", // Secondary theme color
  fontFamily: ""     // Primary font family
};
```

## 3. Meta Information

Define project-wide configurations under the `meta` key:

```javascript
meta: {
  title: "App Title",
  description: "App Description",
  favicon: "/favicon.ico",
  format: "cajs-1",  // Specifies CAJS format version
  shadcnComponents: "Button Card Alert Dialog Toast" // Space-separated string
}
```

The `format` value of `cajs-1` indicates this configuration:
- Uses the CAJS v1 specification
- Includes support for shadcn components
- Includes support for Markdown content
- Follows all conventions defined in this guide

## 4. Page Definitions

Define pages as an object with route paths as keys:

```javascript
pages: {
  // Regular pages: [ComponentName, PageTitle, PageDescription]
  "/": ["HomePage", "Home", "Welcome to our app"],
  "/about": ["AboutPage", "About Us", "Learn more"],

  // Markdown pages: { type: "markdown", content: "markdownKey" }
  "/terms": { type: "markdown", content: "terms-and-conditions" }
}
```

## 5. Component Definitions

Define components using this structure:

```javascript
components: {
  ComponentName: {
    props: ['prop1', 'prop2'],
    element: ['tag.classes', [
      ['childTag.classes', 'content'],
      ['childTag.classes', { attr: 'value' }, 'content']
    ]]
  }
}
```

### 5.1 Using Pre-built Components

To incorporate pre-built components (such as those from ShadCN), use the component name directly in the element array:

```javascript
components: {
  LoginForm: {
    props: ['onSubmit'],
    element: ['div.login-form', [
      ['Card', [
        ['CardHeader', [
          ['CardTitle', 'Login']
        ]],
        ['CardContent', [
          ['Input', { type: 'email', placeholder: 'Email' }],
          ['Input', { type: 'password', placeholder: 'Password' }],
          ['Button', { variant: 'primary' }, 'Sign In']
        ]]
      ]]
    ]]
  }
}
```

Important notes:
- Pre-built components must be listed in `meta.shadcnComponents`
- Use PascalCase when referencing pre-built components
- Props for pre-built components are passed as the second element in the array
- Nested content for pre-built components goes in the third element of the array

### 5.2 Component Composition Rules

1. Native HTML elements are specified in lowercase (e.g., 'div', 'span')
2. Pre-built components are specified in PascalCase (e.g., 'Card', 'Button')
3. Custom components can be referenced using their exact name as defined in the components object
4. The element array structure is always: `[name, ?props, ?children]`
   - `name`: String (required) - The element or component name
   - `props`: Object (optional) - Properties to pass to the element
   - `children`: Array or String (optional) - Nested content

## 6. API Route Definitions

Define API routes as objects with HTTP methods as keys:

```javascript
api: {
  "/api/resource": {
    GET: "handlerFunctionName",
    POST: "anotherHandlerFunction"
  }
}
```

## 7. State Management

Define global state under the `state` key:

```javascript
state: {
  global: {
    user: null,
    theme: "light"
  }
}
```

## 8. Styling

Styling can be defined in two ways:

1. Using top-level shortcuts (preferred for basic theming):
```javascript
{
  primaryColor: "#0070f3",
  secondaryColor: "#7928ca",
  fontFamily: "Inter"
}
```

2. Using the detailed `styles` object (optional):
```javascript
styles: {
  utility: {
    extend: {
      colors: { custom: "#123456" }
    }
  },
  custom: {
    className: "css-rules"
  }
}
```

## 9. Internationalization

The `i18n` object is optional and should only be included for multilingual applications:

```javascript
i18n: {
  locales: ["en", "es"],
  defaultLocale: "en",
  translations: {
    key: {
      en: "English text",
      es: "Spanish text"
    }
  }
}
```

## 10. Markdown Content

Define Markdown content under the `markdown` key:

```javascript
markdown: {
  "terms-and-conditions": `
# Terms and Conditions

1. **Acceptance of Terms**
   By accessing this website...
  `,
  "privacy-policy": `
# Privacy Policy

## Information We Collect...
  `
}
```

## 11. Naming Conventions

- Use PascalCase for component names
- Use camelCase for object keys and variable names
- Use kebab-case for CSS classes, file names, and Markdown content keys
- Use UPPERCASE for constant values

## 12. Best Practices

1. Keep the configuration object flat where possible
2. Use meaningful, descriptive key names
3. Use comments to explain complex structures
4. Group related configurations together
5. Avoid deep nesting; aim for a maximum depth of 3-4 levels
6. Use array notation for ordered elements
7. Keep the configuration DRY (Don't Repeat Yourself)
8. Validate the configuration object structure
9. Consider separate files for large Markdown content
10. Use Markdown for content-heavy pages
11. List all shadcn components in meta section
12. Break down complex components into smaller parts