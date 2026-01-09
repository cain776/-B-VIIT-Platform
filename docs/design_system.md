# Design System Documentation

## Overview
This design system defines the visual language for the CRM/EMR platform, focusing on a "Premium," "Modern," and "Dynamic" aesthetic. The core themes are **Deep Space**, **Midnight Grid**, and **Soft Airy Glass**.

## 1. Color Palette

### Primary (Deep Space & Midnight)
Base colors for backgrounds and main structural elements.
- **Deep Space Black**: `#0a0a0a` (Main background)
- **Midnight Blue**: `#0f172a` (Secondary background, sidebars)
- **Starry White**: `#ffffff` (Primary text)
- **Starlight Gray**: `#94a3b8` (Secondary text, icons)

### Accents (Aurora & Glass)
Used for calls to action, highlights, and gradients.
- **Aurora Purple**: `rgba(139, 92, 246, 0.5)` (Primary Brand)
- **Nebula Blue**: `rgba(59, 130, 246, 0.5)` (Secondary Brand)
- **Success Green**: `#10b981`
- **Warning Amber**: `#f59e0b`
- **Error Red**: `#ef4444`

### Glassmorphism (Surfaces)
Standard values for frosted glass effects.
- **Glass Light**: `background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px);`
- **Glass Dark**: `background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(10px);`
- **Border**: `1px solid rgba(255, 255, 255, 0.1)`

---

## 2. Typography

### Font Families
- **Primary**: `Inter`, `Roboto`, `Outfit` (sans-serif)
- **Monospace**: `ui-monospace`, `SFMono-Regular` (code, IDs)

### Hierarchy
- **H1 / Page Title**: `text-3xl`, `font-bold`
- **H2 / Section Title**: `text-xl`, `font-semibold`
- **Body**: `text-sm` (Default), `text-base`
- **Small**: `text-xs` (Captions, labels)

---

## 3. Core Components

### Buttons
**Style**: Premium Frosted Glass
- **Background**: Gradient or Glass transparent
- **Hover**: Increase opacity / Glow effect
- **Transition**: `all 0.3s ease`

### Inputs
**Style**: Floating Labels
- **Container**: Relative positioning
- **Input**: Transparent background, bottom border or full border
- **Label**: Absolute position, transitions to top on focus/content
- **Focus**: Accent color border/glow

### Cards & Panels
- **Background**: Glass Dark (`rgba(0, 0, 0, 0.4)`)
- **Border**: Thin, semi-transparent white
- **Shadow**: `shadow-lg` or `shadow-xl` for depth
- **Radius**: `rounded-xl` or `rounded-2xl`

### Modals
- **Overlay**: Dark backdrop blur
- **Container**: Centered, `rounded-2xl` glass effect
- **Standard Height**: Auto-adjust content
- **Full/Large Height**: `90vh` fixed height (e.g., Signup, Terms)
- **Header**: Sticky or clearly separated with close button

### Navigation (Sidebar)
- **Normal State**: Icon + Text
- **Collapsed State**: Icon only + Centered Badges (Circle shape, number inside)
- **Active State**: Highlighted background (Aurora gradient) + White text
