# 📱 WheelchairTaxiPro – Mobile Wireframe Description (中英對照)
# 📱 專業輪椅的士 – 手機介面線框設計說明（中英對照）

---

## 🧾 Branding（品牌）

**EN:**
Application Name: **Wheelchair Taxi Pro**

**繁體中文：**
應用名稱：**專業輪椅的士**

---

## 1. Overall Layout（整體佈局）

**EN:**
The application follows a mobile-first design, optimized for one-handed use. The layout is structured from bottom to top, prioritizing quick actions and essential functions within thumb reach.

**繁體中文：**
本應用採用手機優先（Mobile-first）設計，針對單手操作進行優化。整體介面由下而上排列，將最重要及最常用的功能放置於拇指容易觸及的位置。

---

## 2. Layer 1 – Quick Contact Actions（底部聯絡按鈕層）

**Position（位置）：** Fixed at the bottom（固定於畫面最底部）

**EN:**
This layer provides instant access to booking via communication channels.

**繁體中文：**
此層提供用戶即時聯絡及預約的快捷方式。

### Components（元件）:
- 📞 Call（電話）
- 💬 WeChat（微信）
- 🟢 WhatsApp

### Behaviour（行為）：

**EN:**
- Always visible (sticky)
- Call → opens phone dial
- WeChat / WhatsApp → opens chat or web fallback

**繁體中文：**
- 永遠顯示（固定）
- 電話 → 直接撥號
- 微信 / WhatsApp → 開啟聊天或網頁版本（如未安裝）

### Design Notes（設計重點）：
- Large buttons（大按鈕）
- High contrast（高對比）
- 3 equal sections（三等分排列）

---

## 3. Layer 2 – Navigation Bar（導航列）

**Position（位置）：** Above contact buttons（位於聯絡按鈕上方）

### Tabs（分頁）：
1. 🗺️ Route（路線）
2. 📅 Booking（預約）
3. 💲 Price（收費）

### Behaviour（行為）：

**EN:**
- Tap to switch content
- Active tab highlighted

**繁體中文：**
- 點擊切換內容
- 當前頁面高亮顯示

---

## 4. Layer 3 – Main Content Area（主要內容區）

**EN:**
Dynamic content area that changes based on selected tab.

**繁體中文：**
根據所選分頁動態顯示不同內容。

---

### 🗺️ Route Tab（路線頁）

**EN:**
Allows users to calculate routes and estimate pricing.

**繁體中文：**
讓用戶規劃路線並預估價格。

#### Components（元件）：

1. Map（地圖）
   - Shows **current user location（用戶現時位置）**
   - Displays **start location（起點）** and **destination（終點）**
   - Draws **route（繪畫路線）**

2. Input Panel（輸入欄）
   - Start location（起點）
   - Destination（終點）

3. Price Estimate（預估價格）

#### Interaction（互動流程）：

**EN:**
User inputs start and destination → map updates → route is drawn → estimated price is displayed

**繁體中文：**
用戶輸入起點及終點 → 地圖更新 → 繪畫路線 → 顯示預估價格

---

### 📅 Booking Tab（預約頁）

**EN:**
Displays a structured booking form.

**繁體中文：**
顯示結構化預約表單。

#### Fields（欄位）：
- Name（姓名）
- Phone（電話）
- Email（電郵）
- Date & Time（日期時間）
- Pickup（上車地點）
- Destination（目的地）
- Passengers（乘客數量）

#### Action（操作）：
- Submit button（提交按鈕）

**EN:**
Form submits booking via email.

**繁體中文：**
提交後會透過電郵發送預約資料。

---

### 💲 Price Tab（收費頁）

**EN:**
Displays pricing explanation.

**繁體中文：**
展示收費說明。

#### Sections（內容）：
- Vehicle types（車型）
- Service fees（服務費）
- Capacity（可載人數）

#### Notes（備註）：
- Final price depends on actual trip

---

## 5. Top Layer – Header（頂部標題）

**EN:**
Displays logo and branding (**Wheelchair Taxi Pro**).

**繁體中文：**
顯示品牌標誌及橫幅（**專業輪椅的士**）。

---

## 6. User Flow（使用流程）

**EN:**
1. User enters route
2. Reviews price estimate
3. Submits booking or contacts driver

**繁體中文：**
1. 用戶輸入路線
2. 查看價格預估
3. 提交預約或直接聯絡司機

---

## 7. Key UX Strategy（設計策略）

**EN:**
- Fast booking priority
- Minimal input effort
- Clear pricing

**繁體中文：**
- 快速完成預約
- 減少輸入負擔
- 收費清晰透明

---

## 8. Technical Flow（技術流程）

Frontend (Angular)
↓
Backend (.NET API)
↓
Email Service

---

## 9. Open Question（待確認問題）

**EN:**
How is the booking confirmed after submission?
- Will the driver confirm via phone, WhatsApp, or email?
- Is there an automated confirmation message?
- Should the system support real-time booking status in the future?

**繁體中文：**
預約提交後如何確認？
- 司機會透過電話、WhatsApp 或電郵確認嗎？
- 是否需要自動確認訊息？
- 未來是否需要支援即時預約狀態追蹤？

---

## 10. Summary（總結）

**EN:**
The design focuses on speed, simplicity, and accessibility, ensuring users can quickly estimate and book wheelchair taxi services.

**繁體中文：**
此設計以速度、簡潔及易用性為核心，讓用戶能快速完成輪椅的士預約。

