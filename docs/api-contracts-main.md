# API Contracts & Integration Points

## 📡 API Overview

This document describes the external API endpoints and integration points used by the test framework and the target application (SauceDemo).

---

## 🌐 SauceDemo Application - HTTP Endpoints

### Application URLs

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Login page |
| `/inventory.html` | GET | Product inventory |
| `/cart.html` | GET | Shopping cart |
| `/checkout-step-one.html` | GET | Checkout form |
| `/checkout-step-two.html` | GET | Order review |
| `/checkout-complete.html` | GET | Order confirmation |

### Login Endpoint

**Request:**
```
POST /
Content-Type: application/x-www-form-urlencoded

user-name=standard_user&password=secret_sauce&login-button=
```

**Response:**
```
302 Redirect to /inventory.html
Set-Cookie: session_id=<session_token>
```

**Response Body (Error):**
```html
<h3 data-test="error">Username and password do not match any user in this service</h3>
```

---

## 📦 Request/Response Patterns

### Authentication State

**Session Management:**
- Uses cookies for session tracking
- Cookie name: `session_id`
- Session persists across navigation
- Logout clears session

**Headers:**
```
User-Agent: Mozilla/5.0...
Accept: text/html, application/xhtml+xml
Accept-Language: en-US,en;q=0.9
Connection: keep-alive
```

---

## 🔐 Security & Auth

### Login Flow

1. **User submits credentials** (POST /)
2. **Server validates**
3. **Sets session cookie** (302 redirect)
4. **Redirects to inventory**
5. **User authenticated**

### Logout

**Request:**
```
Click logout button
```

**Response:**
```
302 Redirect to /
Session cookie cleared
```

### Special User Behaviors

| User | Behavior | Response |
|------|----------|----------|
| `standard_user` | Normal access | 302 Redirect to inventory |
| `locked_out_user` | Blocked login | 401 Error message |
| `problem_user` | Images broken | 200 OK (missing images) |
| `performance_glitch_user` | Slow responses | 200 OK (delayed) |
| `error_user` | Server errors | 500 Internal errors |
| `visual_user` | Different styling | 200 OK (CSS changes) |

---

## 🛍️ Product Data API

### Product Inventory

**Endpoint:** `/inventory.html`

**Response Structure:**
```html
<div data-test="inventory-list">
  <div class="inventory-item" data-test="inventory-item">
    <img src="/static/..." />
    <div data-test="inventory-item-name">Product Name</div>
    <div data-test="inventory-item-desc">Description</div>
    <div class="pricebar">
      <span data-test="inventory-item-price">$Price</span>
    </div>
  </div>
</div>
```

### Product Information

| Product | Price | Description |
|---------|-------|-------------|
| Sauce Labs Backpack | $29.99 | carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unnoticed utility. |
| Sauce Labs Bike Light | $9.99 | A red light isn't the desired state in testing but a red bike light is. Be the cycling envy of your friends with this rad Bike Light. |
| Sauce Labs Bolt T-Shirt | $15.99 | Get your testing superhero on with the Sauce Labs bolt T-shirt complete with What You Test Is What You Ship techinique on front and back. |
| Sauce Labs Fleece Jacket | $49.99 | It's not just a fleece. It's specifically a mid-layer boasting heavyweight polartec nylon construction. Wear it when it's cold. Wear it when it's cool. Wear it when you want to make a statement. |
| Sauce Labs Onesie | $7.99 | Uh... a onesie? Great for a late night SDET debugging session. |
| Test.allTheThings() T-Shirt (Red) | $15.99 | This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to do some testing automation. Go bold with the red color. |

---

## 🛒 Cart Operations

### Add to Cart

**Request:**
```
Click [data-test="add-to-cart"] for product
```

**Response:**
```
DOM Updated:
- Button text changes to "Remove from cart"
- Cart badge appears/increments
- Item added to cart (stored in DOM/session)
```

### Remove from Cart

**Request:**
```
Click [data-test="remove-button"] for cart item
```

**Response:**
```
DOM Updated:
- Item removed from DOM
- Cart count decremented
- Button text reverts to "Add to cart"
```

### Get Cart Total

**Calculation:**
```
subtotal = sum(item.price * item.quantity)
tax = subtotal * 0.08  (8% tax)
total = subtotal + tax
```

---

## 💳 Checkout Process

### Checkout Step 1 - User Info

**Endpoint:** `/checkout-step-one.html`

**Form Fields:**
```
input[data-test="firstName"]       - First name (required)
input[data-test="lastName"]        - Last name (required)
input[data-test="postalCode"]      - Postal code (required)
```

**Submit Button:**
```
input[data-test="continue"]        - Proceed to review
button[data-test="cancel"]         - Cancel checkout
```

### Checkout Step 2 - Review

**Endpoint:** `/checkout-step-two.html`

**Displayed Information:**
```
- Order items with prices
- Cart subtotal
- Tax calculation
- Total amount
```

**Action Buttons:**
```
button[data-test="finish"]         - Complete order
button[data-test="cancel"]         - Go back
```

### Checkout Complete

**Endpoint:** `/checkout-complete.html`

**Success Response:**
```html
<h2 data-test="complete-header">Thank you for your order!</h2>
<div data-test="complete-text">
  Your order has been dispatched, and will arrive just as fast as the pony express 
  can get it there!
</div>
```

---

## 📊 Data Persistence

### Browser Storage

**Session State:**
- Stored in DOM/JavaScript memory
- Persists during browser session
- Cleared on logout
- No localStorage/sessionStorage API

**Data Structure (Internal):**
```javascript
// Session object (JavaScript)
{
  user: {
    username: 'standard_user',
    authenticated: true,
    session_id: 'abc123'
  },
  cart: {
    items: [
      { id: 1, name: 'Product 1', price: 29.99, quantity: 1 }
    ],
    total: 32.31  // includes tax
  }
}
```

---

## 🔄 Request/Response Content-Types

### HTML Responses
```
Content-Type: text/html; charset=utf-8
Content-Length: [bytes]
```

### Static Assets
```
CSS Files:    Content-Type: text/css
JS Files:     Content-Type: text/javascript
Image Files:  Content-Type: image/png (or jpeg, etc.)
```

---

## 🌐 Cross-Browser Compatibility

### Browser Support
- Chrome/Chromium - ✅ Full support
- Firefox - ✅ Full support
- Safari (WebKit) - ✅ Full support
- Mobile Chrome - ✅ Full support
- Mobile Safari - ✅ Full support

### HTTP/2 Support
- Modern browsers: ✅ HTTP/2
- Legacy: ⚠️ HTTP/1.1 fallback

---

## 🔐 HTTPS & Security

### SSL/TLS
- SauceDemo uses HTTPS
- Valid certificate
- No self-signed cert issues in Playwright (auto-handled)

### CORS
- Same-origin requests only
- No cross-origin API calls in typical usage

---

## 📍 Error Handling

### HTTP Error Codes

| Code | Scenario | Example |
|------|----------|---------|
| 200 | Success | Page loaded |
| 302 | Redirect | Login success → inventory |
| 400 | Bad request | Invalid form data |
| 401 | Unauthorized | Wrong credentials |
| 500 | Server error | error_user behavior |

### Client-Side Errors

| Error | Trigger | Message |
|-------|---------|---------|
| Invalid Username | Empty username field | "Epic sadface: Username is required" |
| Invalid Password | Empty password field | "Epic sadface: Password is required" |
| Invalid Credentials | Wrong user/pass combo | "Username and password do not match any user in this service" |
| Locked Out | locked_out_user login | "Epic sadface: Sorry, this user has been locked out." |

---

## ⚡ Performance Characteristics

### Page Load Times

| Page | Standard User | Performance User |
|------|---------------|------------------|
| Login | ~500ms | ~3000ms |
| Inventory | ~600ms | ~3000ms |
| Cart | ~400ms | ~2000ms |
| Checkout | ~700ms | ~3000ms |

### Network Requests

Typically 10-30 requests per page:
- HTML document
- CSS files (~2-3)
- JavaScript files (~2-3)
- Image assets (~6+ for inventory)

### Caching

- Static assets cached by browser
- No API response caching shown
- Each page load re-fetches HTML

---

## 🔗 Integration Points for Tests

### Test Framework Endpoints

The test framework interacts with:
1. **Login Page** - Username/password submission
2. **Inventory Page** - Product browsing, cart operations
3. **Cart Page** - Item review, cart totals
4. **Checkout Pages** - User info, order confirmation

### Playwright Integration

- No special headers required
- Automatic cookie handling
- Automatic redirection following
- No session token management needed

---

## 📝 API Documentation References

### Official Resources
- **SauceDemo Repository** - https://github.com/saucelabs/sample-app-web
- **Sauce Labs Docs** - https://saucelabs.com
- **Playwright Network** - https://playwright.dev/docs/api/class-apirequestcontext

---

## 🧪 Testing API Endpoints

### Via Playwright

```javascript
test('API request test', async ({ page }) => {
  // Intercept network requests
  page.on('response', async response => {
    console.log(response.url());
    console.log(response.status());
  });
  
  // Trigger request
  await page.goto('https://www.saucedemo.com/inventory.html');
});
```

### Mock Endpoints

```javascript
test('with mocked response', async ({ page }) => {
  await page.route('**/inventory*', route => {
    route.abort('blockedbyclient');
  });
  
  // Now requests to inventory fail
  await page.goto('https://www.saucedemo.com/inventory.html');
});
```

---

## 🔐 Session Management

### Cookie-Based Sessions

**Session Flow:**
```
1. User logs in
2. Server creates session
3. Sets session_id cookie
4. Browser automatically includes in requests
5. Server validates session_id
6. User stays logged in

7. User logs out
7. Session cookie cleared
8. Requests now unauthenticated
```

---

## 📋 Summary

| Aspect | Details |
|--------|---------|
| **Protocol** | HTTPS |
| **Auth Method** | Form-based (username/password) |
| **Session Storage** | HTTP Cookies |
| **Content Type** | HTML/CSS/JS (no JSON APIs) |
| **Cart State** | Browser session/DOM |
| **Data Persistence** | Session-based (lost on logout) |

---

**Last Updated**: 2026-06-22  
**Target Application**: SauceDemo  
**Framework**: Playwright 1.61.0+
