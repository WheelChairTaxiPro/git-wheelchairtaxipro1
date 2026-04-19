# WheelchairTaxiPro – Wireframe & Build Specification

## Communication Integration (UPDATED)

### Direct Call Support (PWA)

The application supports direct communication methods via PWA:

#### 📞 Mobile Phone Call
- Use `tel:` protocol
- Opens device dialer
- Requires user confirmation

Example:
<a href="tel:+85212345678">Call</a>

---

#### 💬 WhatsApp Integration
- Use official WhatsApp deep link

Example:
<a href="https://wa.me/85212345678">WhatsApp</a>

With pre-filled message:
<a href="https://wa.me/85212345678?text=I need a wheelchair taxi">WhatsApp</a>

Behavior:
- Opens WhatsApp app if installed
- Falls back to WhatsApp Web

---

#### 🟢 WeChat Integration (Recommended Approach)

Due to platform limitations, direct chat is not reliably supported.

Recommended methods:

1. Display QR Code
2. Provide copyable WeChat ID

Example UX:
- Click WeChat button → show QR modal
- Option to copy WeChat ID

---

### Platform Compatibility

| Feature | Mobile | Desktop |
|--------|--------|--------|
| Phone Call | ✅ | ⚠️ depends |
| WhatsApp | ✅ | ✅ |
| WeChat | ⚠️ QR | ⚠️ limited |

---

### Recommendation

- Use `tel:` for phone calls
- Use `wa.me` for WhatsApp
- Use QR + ID for WeChat

---

This ensures compatibility across Hong Kong and China environments.
