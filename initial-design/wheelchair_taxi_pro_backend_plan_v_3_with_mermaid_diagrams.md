# WheelchairTaxiPro – Backend Architecture Plan (Phase 1 + Mermaid Diagrams)

## 1. Overview

This document explains the backend using **Vertical Slice Architecture** with simple handlers.

---

## 2. High-Level Structure

```mermaid
flowchart TD

A[Client / Frontend] --> B[API Controller]
B --> C[Feature Handler]
C --> D[Service / Provider]
D --> E[External API / Database]

```

---

## 3. Vertical Slice Structure

```mermaid
flowchart LR

subgraph TaxiDiscovery Slice
    A1[Controller]
    A2[Request]
    A3[Handler]
    A4[Models]
end

subgraph TripPlanning Slice
    B1[Controller]
    B2[Request]
    B3[Handler]
    B4[Models]
end

subgraph FareEstimation Slice
    C1[Controller]
    C2[Request]
    C3[Handler]
    C4[Models]
end

A1 --> A3
B1 --> B3
C1 --> C3

```

---

## 4. Folder Structure (Visual)

```mermaid
graph TD

Root[src]

Root --> Features
Root --> Core
Root --> Infrastructure
Root --> API

Features --> TaxiDiscovery
Features --> TripPlanning
Features --> FareEstimation

TaxiDiscovery --> TD1[GetNearbyTaxis]
TD1 --> TD2[Request]
TD1 --> TD3[Handler]
TD1 --> TD4[Response]

Infrastructure --> MapProviders
MapProviders --> Tencent
MapProviders --> Amap
MapProviders --> Baidu

```

---

## 5. Request Flow (Detailed)

```mermaid
sequenceDiagram

participant User
participant Controller
participant Handler
participant MapProvider
participant ExternalAPI

User->>Controller: HTTP Request
Controller->>Handler: Handle(Request)
Handler->>MapProvider: GetNearbyDrivers()
MapProvider->>ExternalAPI: Call Map API
ExternalAPI-->>MapProvider: Data
MapProvider-->>Handler: Result
Handler-->>Controller: Response
Controller-->>User: JSON Response

```

---

## 6. Map Provider Strategy (Adapter Pattern)

```mermaid
flowchart TD

A[Handler] --> B[IMapProvider]

B --> C[TencentMapProvider]
B --> D[AmapProvider]
B --> E[BaiduProvider]

C --> F[Tencent API]
D --> G[Amap API]
E --> H[Baidu API]

```

---

## 7. Feature Independence

```mermaid
flowchart LR

TaxiDiscovery -->|No dependency| FareEstimation
TaxiDiscovery -->|No dependency| Communication
TripPlanning -->|No dependency| TaxiDiscovery

```

---

## 8. Evolution Path

```mermaid
flowchart LR

A[Phase 1: Simple Handlers]
--> B[Phase 2: Shared Utilities]
--> C[Phase 3: Optional Mediator]
--> D[Phase 4: Microservices]

```

---

## 9. Key Insight

Vertical Slice Architecture means:

- Each feature is self-contained
- Minimal shared logic
- Easy to extend

---

END

