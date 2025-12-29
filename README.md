# 🚛 FMVTS Vehicle Microservice

The **FMVTS Vehicle Microservice** is responsible for managing all **vehicle-related operations** within the Fleet Management and Vehicle Tracking System (FMVTS).

It acts as the **central authority for vehicle data**, handling vehicle registration, status tracking, driver assignment, maintenance state, and synchronization with other services through **REST APIs and event-driven communication**.

---

## 📌 Core Responsibilities

- Register new vehicles into the fleet
- View vehicle details and current status
- Update vehicle operational status
- Assign and unassign vehicles to drivers
- Validate driver availability before assignment
- Retire vehicles from active fleet
- Publish driver–vehicle assignment events
- Subscribe to trip completion events to capture distance travelled

---

## 🏗️ Architecture Role

User Microservice ◀──────┐
│
Trip Microservice ──▶ Vehicle Microservice ──▶ Event Queue
│
└──────▶ User Microservice (Driver Sync)




- Acts as the **source of truth for vehicle data**
- Communicates synchronously with the **User Microservice**
- Uses asynchronous events for trip and driver synchronization

---

## 🔐 Authentication & Authorization

- All protected routes require **JWT authentication**
- User role is propagated via API Gateway using `x-user-role`
- Role-based access control is enforced at the service level
- Only authorized roles can perform sensitive operations like:
  - Vehicle assignment
  - Vehicle retirement

---

## 🚘 Vehicle Management Capabilities

### 🚗 Vehicle Registration
- Register new vehicles with core attributes
- Initialize vehicle status and operational metadata

### 📄 View Vehicle Information
- Fetch complete vehicle details
- Retrieve vehicle status (Active, Inactive, Retired)

### 🔄 Update Vehicle Status
- Update operational status
- Mark vehicles inactive or active based on business rules

### 👤 Driver Assignment & Unassignment
- Communicates with **User Microservice** to:
  - Validate driver availability status
- Assigns vehicle only if driver is available
- Unassigns vehicle when required
- Publishes driver–vehicle mapping events to User Microservice

### 🛑 Retire Vehicle
- Permanently removes vehicle from active fleet
- Prevents further assignment or trip initiation

---

## 🔄 Event-Driven Synchronization

### 📤 Published Events
- Driver assignment and unassignment events
- Vehicle details for driver synchronization

### 📥 Subscribed Events
- **Trip Completion Events** from Trip Microservice
  - Captures distance travelled
  - Updates vehicle trip metrics
  - Ensures vehicle usage history stays in sync

---

## 📍 API Capabilities (High-Level)

| Capability | Description |
|----------|-------------|
| Vehicle registration | Add new vehicles to fleet |
| Vehicle status | Track and update operational status |
| Driver assignment | Assign/unassign vehicles after validation |
| Retirement | Retire vehicles from active fleet |
| Event publishing | Sync driver and vehicle data |
| Event subscription | Capture trip distance updates |

---


▶️ Running the Service


       Install Dependencies


           npm install



       Start Application


           npm start

