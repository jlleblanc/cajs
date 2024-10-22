# CAJS Configuration Style Guide v2

## Table of Contents
1. [Introduction](#1-introduction)
2. [Project Structure](#2-project-structure)
3. [Meta Information](#3-meta-information)
4. [Page Definitions](#4-page-definitions)
5. [Component Definitions](#5-component-definitions)
6. [API Route Definitions](#6-api-route-definitions)
7. [State Management](#7-state-management)
8. [Styling](#8-styling)
9. [Internationalization](#9-internationalization)
10. [Markdown Content](#10-markdown-content)
11. [Naming Conventions](#11-naming-conventions)
12. [Best Practices](#12-best-practices)

## 1. Introduction

This style guide outlines the conventions for creating and maintaining a CAJS (Component Architecture JavaScript) configuration for component-based applications, with added support for Markdown content. It aims to provide a consistent, readable, and maintainable structure for application configurations.

## 2. Project Structure

The top-level structure of the configuration object should include these keys:

```javascript
const appConfig = {
  meta: {},           // Project-wide configurations
  pages: {},          // Page/route definitions
  components: {},     // Component definitions
  api: {},            // API route definitions
  state: {},          // Global state management
  styles: {},         // Custom styling configurations
  i18n: {},           // Internationalization settings
  markdown: {}        // Markdown content
};
```

## 3. Meta Information

Define project-wide configurations under the `meta` key:

```javascript
meta: {
  title: "App Title",
  description: "App Description",
  favicon: "/favicon.ico",
  dependencies: { /* key-value pairs */ },
  shadcnComponents: ['Component1', 'Component2']
}
```

## 4. Page Definitions

Define pages as an object with route paths as keys. For regular pages, use arrays as values. For Markdown pages, use objects:

```javascript
pages: {
  "/": ["HomePage", "Home", "Welcome to our app"],
  "/about": ["AboutPage", "About Us", "Learn more about our company"],
  "/terms": { type: "markdown", content: "terms-and-conditions" }
}
```

- Regular pages: [ComponentName, PageTitle, PageDescription]
- Markdown pages: { type: "markdown", content: "markdownKey" }

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

- Use array notation for element structure: [tag+classes, children/props]
- For dynamic content, use placeholders: '{propName}'

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

Define styles under the `styles` key:

```javascript
styles: {
  utility: {
    extend: {
      colors: { primary: "#FF69B4" }
    }
  },
  custom: {
    className: "css-rules"
  }
}
```

## 9. Internationalization

Define i18n settings and translations:

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
  "terms-and-conditions": "
# Terms and Conditions

1. **Acceptance of Terms**
   By accessing this website, you agree to be bound by these terms and conditions.

2. **Use License**
   Permission is granted to temporarily download one copy of the materials...

   (Rest of the Markdown content)
  ",
  "privacy-policy": "
# Privacy Policy

## 1. Information We Collect

We collect information you provide directly to us, such as...

(Rest of the Markdown content)
  "
}
```

## 11. Naming Conventions

- Use camelCase for object keys and variable names
- Use PascalCase for component names
- Use kebab-case for CSS classes, file names, and Markdown content keys
- Use UPPERCASE for constant values

## 12. Best Practices

1. Keep the configuration object flat where possible
2. Use meaningful, descriptive key names
3. Use comments to explain complex structures or provide context
4. Group related configurations together
5. Avoid deep nesting; aim for a maximum depth of 3-4 levels
6. Use array notation for ordered elements (like in component definitions)
7. Keep the configuration DRY (Don't Repeat Yourself) by using variables or functions for repeated values
8. Validate the configuration object structure in your application to catch errors early
9. For Markdown content, consider using separate files for very large content and importing them into the configuration
10. Use Markdown for content-heavy pages or sections where rich formatting is beneficial
11. When using shadcn components, list them in the meta section for easy reference
12. For complex components, consider breaking them down into smaller, reusable parts
