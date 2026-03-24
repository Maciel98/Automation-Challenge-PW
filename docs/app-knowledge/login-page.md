# Login Page

**URL:** https://www.saucedemo.com/
**Auth Required:** No
**Title:** Swag Labs

## Overview

The login page is the entry point for the SauceDemo application. Users authenticate using one of six pre-configured test accounts with a shared password.

## Confirmed Element Locators

### Form Fields

| Element | Selector | Type | Purpose |
|---------|----------|------|---------|
| Username input | `[data-test="username"]` | input | Enter username |
| Password input | `[data-test="password"]` | input | Enter password |
| Login button | `[data-test="login-button"]` | input | Submit login form |

### Information Display

| Element | Selector | Content |
|---------|----------|---------|
| Login container | `[data-test="login-container"]` | Main form wrapper |
| Accepted usernames | `[data-test="login-credentials"]` | List of valid usernames |
| Password info | `[data-test="login-password"]` | Shared password info |

## Test Users (Pre-configured)

All users share the same password: `secret_sauce`

| Username | Type | Behavior |
|----------|------|----------|
| `standard_user` | Valid | Normal login, full access |
| `locked_out_user` | Locked | Error: "Sorry, this user has been locked out." |
| `problem_user` | Problematic | Login works, images broken |
| `performance_glitch_user` | Slow | Login works, intentional delays |
| `error_user` | Buggy | Errors during cart/checkout |
| `visual_user` | Visual | For visual/UI testing |

## Key User Interactions

### Login Flow

1. **Fill username field**
   - Selector: `[data-test="username"]`
   - Input: Valid username from list above

2. **Fill password field**
   - Selector: `[data-test="password"]`
   - Input: `secret_sauce`

3. **Click login button**
   - Selector: `[data-test="login-button"]`
   - Trigger: Form submission
   - Success: Redirects to `/inventory.html`
   - Failure: Shows error message, stays on login page

### Error Handling

| Scenario | Expected Error Message |
|----------|----------------------|
| Empty username | Error displayed |
| Empty password | Error displayed |
| Wrong password | "Username and password do not match" |
| Locked user | "Sorry, this user has been locked out." |
| Invalid user | "Username and password do not match" |

## API Calls

- **POST** to login endpoint (internal) on form submission
- No external API calls

## Navigation

- **Success** → Redirects to `/inventory.html`
- **Failure** → Stays on login page (`/index.html`)
