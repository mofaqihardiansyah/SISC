# Authentication Page System Design & Implementation Guide

This document defines the UI/UX standards for the SISC authentication system (Login, Register, Verify) to ensure consistency, role-based logic, and premium responsiveness.

## 1. Role & Access Logic
The system features 3 primary roles with distinct authentication flows:

| Role | Login | Register | Notes |
| :--- | :---: | :---: | :--- |
| **Pengunjung** | Yes | Yes | General users seeking event information. |
| **Penyelenggara** | Yes | Yes | Organizers with event management access. |
| **Admin** | Yes | No | **Strict:** Admin accounts are seeded. No registration link allowed. |

## 2. Design Tokens (Premium Refinements)

### Typography & Sizes
- **Heading:** `Montserrat` (Variable: `--font-heading`) - Used for impactful titles and branding.
- **Body & Form:** `Inter` (Variable: `--font-inter`) - Focus on high readability for form fields.
- **Refined Sizes:** Use `text-3xl` for main page titles and `text-sm` for labels and descriptions.

### Color Palette (Indigo Premium)
- **Primary Action:** Indigo-600 (`#4F46E5`) - Primary buttons, links, and branding.
- **Branding Panel:** Indigo-600 (`#4F46E5`) with subtle abstract blur decorative elements.
- **Form Surface:** Pure `white` for high contrast.
- **Inputs:** `bg-white`, `border-slate-200`, `h-12`, `rounded-lg`.

### Components Style
- **Buttons:** - `rounded-lg`, `h-12`.
  - `font-bold`, `transition-all`, `active:scale-[0.98]`.
  - Hover effect: `hover:bg-indigo-700`, `shadow-none` for a modern flat look.
- **Inputs:** - `h-12`, `rounded-lg`.
  - `focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`.
  - `bg-white`, `border-slate-200`.

## 3. UI/UX Flow: Role Switching & Logic
- **Tabs Layout:** Grid-based selector with roles.
- **Visual Feedback:** `bg-slate-100/80` container with `white` active tab and `shadow-sm`.
- **Dynamic Content:** Hide "Register" link completely when the **Admin** tab is active in Login.

## 4. Layout Strategy: Zero-Scroll Split-Screen
Desktop view must fit within 100vh without vertical scrolling for the main container.

```tsx
<div className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-white">
  {/* Branding Side (Left) */}
  <div className="hidden md:flex md:w-1/2 bg-indigo-600 p-16 lg:p-24 flex-col justify-between relative overflow-hidden">
    {/* Abstract patterns and logo */}
  </div>

  {/* Form Side (Right) */}
  <div className="w-full md:w-1/2 h-full bg-white flex flex-col p-8 md:p-12 lg:p-20 overflow-y-auto">
    <div className="w-full max-w-md mx-auto my-auto py-12">
      {/* Form Content */}
    </div>
  </div>
</div>
```