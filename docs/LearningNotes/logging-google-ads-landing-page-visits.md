# Logging Google Ads Landing Page Visits

> Goal: understand how to record suspicious Google Ads clicks after they land on the website, so repeated malicious visitors can be reviewed and blocked.

This note is about **ad-click protection**, not normal marketing analytics.

For normal visitor analytics, use Google Analytics 4.
For suspicious ad-click investigation, log the landing-page visit at the edge or backend.

---

## 1. The problem

Google Ads can show suspicious activity such as:

- repeated clicks from the same person or network
- clicks that never contact the business
- clicks from outside the target market
- clicks from VPNs, data centres, or competitors
- bursts of clicks at unusual times

Google Ads does not directly show the raw IP address of each ad click.

To know the visitor IP, we need to log the request **when the user lands on our website**.

---

## 1a. Why a website is needed instead of sending ads to Facebook

The current business problem is that Google Ads traffic may be going directly to a Facebook page:

```text
Google Ad
  ↓
Facebook Page
```

That setup is simple, but it gives very little control for malicious-click investigation.

Limitations when the landing page is Facebook:

- We cannot put our own Cloudflare Worker in front of the Facebook page.
- We cannot reliably log the raw visitor IP for each ad landing request.
- We cannot attach our own backend security logic to the first landing request.
- We cannot fully connect ad clicks to our own Call / WhatsApp / WeChat / booking events.
- We depend on Facebook analytics, which is not designed for Google Ads IP investigation.

The website exists partly to become the controlled landing page:

```text
Google Ad
  ↓
wheelchairtaxipro.com landing page
  ↓
Call / WhatsApp / WeChat / Booking / Facebook
```

With our own website as the first stop, we can record:

- visitor IP
- timestamp
- Google click ID (`gclid`, `wbraid`, `gbraid`)
- user agent
- country / region
- landing URL
- whether the visitor clicked Call / WhatsApp / WeChat
- whether the visitor submitted the booking form
- whether the visitor clicked through to Facebook

The website does **not** need to replace Facebook. Facebook can still be linked as a trust/social channel. The key change is that Google Ads should land on the controlled website first, then users can continue to Facebook if they want.

Important limitation: this still does not reveal the person's real identity. It usually reveals only IP, approximate location, device/browser, click ID, and repeat behaviour. The person's name/contact details are known only if they submit a form or contact the business.

---

## 2. What to track

When a visitor arrives from a Google ad, record a small log entry:

```text
timestamp
ip address
country / region if available
landing URL
gclid or wbraid / gbraid
user agent
referrer
path
whether the visitor later clicked Call / WhatsApp / WeChat
whether the visitor submitted the booking form
```

Important Google Ads parameters:

| Parameter | Meaning |
|---|---|
| `gclid` | Google Click ID. Common for normal Google Ads clicks. |
| `wbraid` | Used for some iOS / privacy-preserving web-to-app or web attribution flows. |
| `gbraid` | Used for some privacy-preserving Google Ads attribution flows. |

If a visitor has `gclid`, `wbraid`, or `gbraid`, treat it as a likely paid-ad visit.

---

## 3. Do not track IP in frontend JavaScript

Do **not** try to get the IP address from Angular/browser code.

Reasons:

- Browser JavaScript does not reliably know the real public IP.
- Calling a third-party "what is my IP" service leaks user data to another provider.
- It is easy to fake or block.
- It creates privacy risk.

The correct place to record IP is:

- Cloudflare Worker, because it receives the HTTP request at the edge, or
- backend API, because it receives form/contact/security requests.

---

## 4. Cloudflare Pages vs Cloudflare Worker

### Cloudflare Pages

Cloudflare Pages hosts the static Angular site.

It is good for:

- serving prerendered HTML
- serving JavaScript/CSS/images
- preview deployments per branch
- custom domain hosting
- CDN caching

Pages is mostly a **static hosting** product.

It does not automatically give us custom request-processing logic for every visit.

### Cloudflare Worker

A Cloudflare Worker is code that runs at Cloudflare's edge before a request reaches the site or API.

It is good for:

- reading request headers
- seeing the visitor IP from Cloudflare metadata
- detecting `gclid` / `wbraid` / `gbraid`
- logging suspicious visits
- blocking/challenging IPs before the page loads
- forwarding the request to Cloudflare Pages after logging

Think of it like this:

```text
Visitor
  ↓
Cloudflare Worker  ← inspect/log/block here
  ↓
Cloudflare Pages   ← serve Angular static site
```

Cloudflare Pages serves the app.
Cloudflare Worker can sit in front of it and make decisions about the request.

---

## 5. Where to store the logs

Options:

| Storage | Good for | Notes |
|---|---|---|
| Cloudflare Workers KV | Simple key/value counters | Good for counts by IP/day, not detailed audit logs. |
| Cloudflare D1 | Structured SQL logs | Good for querying suspicious IPs and ad-click patterns. |
| Cloudflare R2 | Raw log files | Good for cheap archive, less convenient for analysis. |
| Backend database | Long-term app-owned records | Best once the .NET backend exists. |
| Third-party logging service | Dashboards and search | Extra cost and privacy review needed. |

For Phase 1, the simplest useful setup is:

```text
Cloudflare Worker + D1
```

The Worker records one row per ad landing visit.

Later, when the .NET API exists, move deeper fraud logic into the backend.

---

## 6. Recommended Phase 1 architecture

Use this for the prototype / early MVP:

```text
Google Ads click
  ↓
https://wheelchairtaxipro.com/?gclid=...
  ↓
Cloudflare Worker
  ├─ read visitor IP from Cloudflare request info
  ├─ read gclid / wbraid / gbraid from URL
  ├─ save landing visit log to D1
  ├─ optionally challenge/block known bad IPs
  ↓
Cloudflare Pages
  ↓
Angular PWA
  ├─ GA4 tracks page_view
  ├─ GA4 tracks contact_tap
  └─ GA4 tracks booking_submit_attempt
```

This gives us:

- ad-click landing logs with IP
- normal analytics in GA4
- Cloudflare-level blocking if needed
- no backend dependency for the first version

---

## 7. Recommended Phase 2 architecture

When the .NET backend booking API exists:

```text
Google Ads click
  ↓
Cloudflare Worker logs landing visit
  ↓
Angular site
  ↓
User submits booking / taps contact
  ↓
.NET backend API
  ├─ records requester IP
  ├─ records user agent
  ├─ rate-limits by IP
  ├─ checks suspicious behaviour
  └─ stores booking/contact security log
```

The Worker is best for **landing-page request logging and early blocking**.

The backend API is best for **business actions**, such as:

- booking submit
- contact request
- fraud score
- rate limiting
- operator review
- linking a booking request to a previous ad-click landing visit

---

## 8. What can be blocked where

### Google Ads IP exclusions

Use this when we have a confirmed suspicious IP.

Google Ads path:

```text
Campaign → Settings → Additional settings → IP exclusions
```

This is important because it can stop ads from showing to that IP.

### Cloudflare WAF / Worker blocking

Use this to protect the website.

Cloudflare can:

- block an IP
- challenge an IP
- rate-limit requests
- block countries/ASNs if necessary

Important limitation:

If the user already clicked the Google ad, blocking at Cloudflare may not prevent the ad click charge.

So:

- Google Ads IP exclusions protect ad spend.
- Cloudflare protects the website.

Use both when needed.

---

## 9. Example Cloudflare Worker logic

Pseudo-code:

```ts
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hasAdClickId =
      url.searchParams.has('gclid') ||
      url.searchParams.has('wbraid') ||
      url.searchParams.has('gbraid');

    const ip = request.headers.get('CF-Connecting-IP');
    const country = request.headers.get('CF-IPCountry');
    const userAgent = request.headers.get('User-Agent');
    const referrer = request.headers.get('Referer');

    if (hasAdClickId) {
      // Save to D1/KV/backend logging endpoint.
      // Keep the stored data minimal and retain it only as long as needed.
    }

    // Continue to Cloudflare Pages / static site.
    return env.ASSETS.fetch(request);
  },
};
```

This is not ready-to-run production code.
It shows where the IP and ad click IDs are available.

---

## 10. Privacy and legal notes

IP addresses can be personal data.

Before storing them:

- keep only what is needed
- limit retention, e.g. 30-90 days
- restrict who can access logs
- do not show raw IP logs publicly
- mention security/anti-fraud logging in the privacy notice
- avoid using the logs for unrelated purposes

For Hong Kong, review PDPO obligations before going live.

---

## 11. Implementation checklist

### Google Ads

- [ ] Enable auto-tagging.
- [ ] Confirm landing URLs keep `gclid`, `wbraid`, or `gbraid`.
- [ ] Add columns for invalid clicks / invalid click rate in Google Ads reports.
- [ ] Learn where IP exclusions live in campaign settings.

### Cloudflare

- [ ] Decide whether to use Worker + D1 for Phase 1.
- [ ] Create a Cloudflare Worker in front of the Pages site.
- [ ] Create D1 table for ad landing logs.
- [ ] Log only visits with `gclid`, `wbraid`, or `gbraid` at first.
- [ ] Add simple suspicious-IP report.
- [ ] Block confirmed malicious IPs in Google Ads first, Cloudflare second.

### Website

- [ ] Add GA4.
- [ ] Track `contact_tap` events.
- [ ] Track `booking_submit_attempt`.
- [ ] Track `booking_submit_success` once backend exists.

### Backend later

- [ ] Record IP and user agent on booking submit.
- [ ] Add rate limiting by IP.
- [ ] Link booking request to ad-click landing visit when `gclid` is present.
- [ ] Add retention policy for security logs.

---

## 12. Recommended decision for this project

For Wheelchair Taxi Pro:

1. Use **GA4** for normal marketing analytics.
2. Use **Cloudflare Worker + D1** for paid-ad landing-page IP logging.
3. Use **Google Ads IP exclusions** to block confirmed suspicious ad clickers.
4. Use **Cloudflare WAF / Worker blocking** to protect the website.
5. Move deeper fraud/rate-limit logic to the **.NET backend API** when booking submission becomes real.

