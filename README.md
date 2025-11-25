# Brand Kit Prototype

A React + TypeScript application for building and managing brand kit data. This app allows you to populate a comprehensive JSON schema for brand foundations, product lines, content types, audiences, regions, examples, and writing rules.

## Features

- ✨ Modern React + TypeScript setup with Vite
- 💾 Automatic local storage persistence with debounced saving
- 📝 Comprehensive form interface for all schema sections
- 🎨 Clean, modern UI with responsive design matching Figma designs
- 🔄 Real-time auto-save with visual feedback
- 📋 Markdown editor with live preview for brand content
- 🏷️ Tag-based writing rules system (Global, Audience, Content Type, Region)
- 📦 Pre-populated data sets (Default, Klaviyo, Xero)
- 🔍 Search and filter functionality for writing rules
- 📄 Full-page detail views for products, audiences, content types, and regions
- 🎯 Card-based layouts with duplicate/delete functionality
- 🎨 Lucide icons throughout the interface

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## Usage

1. **Navigate sections**: Use the sidebar and tabs to navigate between different sections
2. **Version switching**: Select from Default, Klaviyo, or Xero versions in the sidebar
3. **Edit content**: Click into cards or use the detail views to edit content
4. **Add items**: Use "Add" buttons to create new products, audiences, content types, regions, or rules
5. **Manage rules**: Add, edit, or delete writing rules with tag-based filtering
6. **Auto-save**: Your data is automatically saved to local storage as you type

## Schema Structure

The app supports the following sections:

- **Brand Foundations**: Brand name, domain, about your brand, brand story & purpose, tone & voice, and all writing rules
- **Product Lines**: Product details, positioning, ideal customers, and competitors
- **Content Types**: Content samples, tone & voice, and content-specific writing rules
- **Audiences**: Audience descriptions and audience-specific writing rules
- **Regions**: Regional descriptions and region-specific writing rules
- **Examples**: General brand examples with notes

## Writing Rules System

Writing rules can be tagged as:
- **Global**: Applies to all content across the brand kit
- **Audience-specific**: Applies to specific audiences
- **Content Type-specific**: Applies to specific content types
- **Region-specific**: Applies to specific regions

Rules can have multiple tags (except Global, which is exclusive). Tags automatically update when entity names change.

## Figma Integration

This app is designed to work with the Figma MCP server. Designs were translated from Figma to match the UI/UX specifications.

## Tech Stack

- React 19
- TypeScript
- Vite
- CSS3 (no external UI libraries)
- Lucide React (icons)
- react-markdown & remark-gfm (markdown rendering)
