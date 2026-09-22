# TFS Digital — Complete Training Guide
## All Critical Workflows (Training Week — 18 August 2026)

**System:** Thusanang Funeral Services Administrative System  
**Prepared by:** System Analysis  
**Purpose:** Staff training on every critical workflow

---

## Role-to-Module Access Matrix

| Module | Claims Officer | Admin Officer | Branch Manager | Fleet Manager | Asset Manager | Stock Officer | Directors | Enquiries Dept | IT | Marketing |
|--------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 1. Login & Auth | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 2. Client Intake | ✓ | ✓ | — | — | — | — | — | — | — | — |
| 3. Dashboard | — | — | ✓ | — | — | — | — | — | — | — |
| 4. Active Cases | — | ✓ | ✓ | ✓ | — | — | — | — | — | — |
| 5. Case Status | — | ✓ | ✓ | — | — | — | — | — | — | — |
| 6. Vehicle & Driver | — | — | ✓ | ✓ | — | — | — | — | — | — |
| 7. Case Details | — | ✓ | ✓ | — | — | — | — | — | — | — |
| 8. Stock Management | — | — | ✓ | — | ✓ | ✓ | — | — | — | — |
| 9. Stock Transfers | — | ✓ | ✓ | — | ✓ | ✓ | — | — | — | — |
| 10. Purchase Orders | — | — | — | — | — | — | ✓ | — | — | — |
| 11. GRV | — | — | — | — | — | — | ✓ | — | — | — |
| 12. Repatriation | — | ✓ | — | ✓ | — | — | — | — | — | — |
| 13. Airtime Requests | ✓ | — | — | — | — | — | ✓* | — | — | — |
| 14. WhatsApp Chats | — | — | — | — | — | — | — | ✓ | — | — |
| 15. Media Studio | — | — | — | — | — | — | — | — | ✓ | ✓ |
| 16. User Management | — | — | — | — | — | — | ✓* | — | ✓ | — |
| 17. Reports & PDFs | — | — | ✓ | — | ✓ | ✓ | — | — | — | — |
| 18. Trip Sheets | — | — | ✓ | ✓ | — | — | — | — | — | — |

> *\* Managing Director specific responsibility*

---

## Table of Contents

1. [Login & Authentication](#1-login--authentication)
2. [Client Intake (Consultation Form)](#2-client-intake--consultation-form)
3. [Dashboard Operations](#3-dashboard--operational-command-centre)
4. [Active Cases & Case Management](#4-active-cases--case-management)
5. [Case Status Workflow](#5-case-status-workflow--lifecycle)
6. [Vehicle & Driver Assignment](#6-vehicle--driver-assignment)
7. [Case Details & Editing](#7-case-details--editing)
8. [Stock Management](#8-stock-management--inventory)
9. [Stock Transfers (Between Locations)](#9-stock-transfers--between-locations)
10. [Purchase Orders & Procurement](#10-purchase-orders--procurement)
11. [GRV — Goods Received Voucher](#11-grv--goods-received-voucher)
12. [Repatriation Trip Sheets](#12-repatriation-trip-sheets)
13. [Airtime Requests](#13-airtime-requests)
14. [WhatsApp Chats](#14-whatsapp-chats)
15. [Media Studio](#15-media-studio)
16. [User Management (Admin Only)](#16-user-management--admin-only)
17. [Reports & PDF Generation](#17-reports--pdf-generation)
18. [Driver Trip Sheets & Batch Printing](#18-driver-trip-sheets--batch-printing)

---

## 1. Login & Authentication

> **Who:** All Users  
> **Page:** `/login`

### Workflow: Signing In
1. Open the system URL in your browser
2. Enter your **email address** and **password**
3. Click **Sign In**
4. You'll be redirected to the **Intake** page (home)

### Workflow: Forgot Password
1. On the login page, click **"Forgot Password?"**
2. Enter your registered email address
3. Check your email for a **reset link**
4. Click the link → enter your **new password** (min 6 characters)
5. Click **Reset Password** → Sign in with new credentials

### Key Rules
- Passwords must be at least **6 characters**
- Sessions auto-refresh — you stay logged in until you sign out
- If your session expires, the system redirects you to login automatically

---

## 2. Client Intake / Consultation Form

> **Who:** Claims Officer, Admin Officer  
> **Page:** `/` (Home page)  
> **File:** [ConsultationForm.jsx](file:///c:/Users/Bongz/Documents/WORK/SYSTEM/tfs_digital/client/src/ConsultationForm.jsx)

### Workflow: Creating a New Case

#### Step 1 — Deceased Information
- Full name, ID number, date of death
- Gender, age

#### Step 2 — Next-of-Kin / Client Details
- Name, phone number, relationship
- Policy number (if applicable)

#### Step 3 — Select Funeral Plan
The system offers these plans (auto-populates benefits):

| Plan | Casket | Chairs | Programmes | Airtime | Cashback |
|------|--------|--------|------------|---------|----------|
| Budget Buster | Flat Lid | 50 | 50 | — | — |
| Plan A | 3 Tier | 50 | 100 | R100 | R2,000 |
| Plan B | Econo | 50 | 100 | R100 | R2,000 |
| Plan C | Pongee | 100 | 100 | R100 | R4,000 |
| Plan D | Raised Halfview | 100 | 100 | R200 | R5,000 |
| Plan E | 4 Tier + Tombstone (Head) | 200 | 150 | R200 | R6,000 |
| Plan F | 4 CNR Woodturning + Tombstone (Head & Slab) | 200 | 150 | R200 | — (Catering included) |

**Note:** When you select a plan, the system automatically fills in the tent, tables, toilets, flowers, crucifix, and service details. You can still override any item manually.

#### Step 4 — Service Details
- Funeral date and time
- Venue / church
- Traditional elements (livestock, tombstone, etc.)

#### Step 5 — Payment & Pricing
- System auto-calculates pricing based on plan
- Record payment status and amounts

#### Step 6 — Submit
- Click **Submit** → Case is created with status **"Intake"**
- Case appears in **Active Cases** and on the **Dashboard**

### Workflow: Saving & Loading Drafts
- **Save Draft:** Click "Save Draft" to save work-in-progress (linked by policy number)
- **Load Draft:** When returning to the form, if a draft exists for the policy number, it auto-loads
- **Draft History:** View previous versions of saved drafts

### Workflow: Looking Up Existing Cases
- Use the **Lookup** feature at the top of the form
- Search by **policy number** or **deceased name**
- Loads all case details for editing

---

## 3. Dashboard / Operational Command Centre

> **Who:** Branch Manager  
> **Page:** `/dashboard`  
> **File:** [Dashboard.jsx](file:///c:/Users/Bongz/Documents/WORK/SYSTEM/tfs_digital/client/src/pages/Dashboard.jsx)

### What the Dashboard Shows

| Metric | Description |
|--------|-------------|
| **Upcoming Funerals** | Count of funerals scheduled in the coming days |
| **Vehicles Needed** | Number of vehicles required for upcoming services |
| **Vehicles Available** | Number of vehicles currently free |
| **Low Stock Alerts** | Items below their minimum stock threshold |
| **Outstanding Drafts** | Saved but unsubmitted consultation forms |
| **Outstanding Intakes** | Cases still in "Intake" status |
| **Groceries Total/Submitted** | Grocery order tracking |

### Workflow: Searching for a Case
1. Type a **deceased name** or **policy number** in the search bar
2. Results appear instantly below
3. Click a result → goes to the **Case Details** page

### Workflow: Using the Vehicle Calendar
- The dashboard includes an interactive **Vehicle Calendar** showing:
  - Which vehicles are assigned on which dates
  - Which drivers are assigned
  - Service times and venues
- Click any date to see full assignment details

---

## 4. Active Cases & Case Management

> **Who:** Admin Officer, Branch Manager, Fleet Manager  
> **Page:** `/active-cases`  
> **File:** [ActiveCases.jsx](file:///c:/Users/Bongz/Documents/WORK/SYSTEM/tfs_digital/client/src/pages/ActiveCases.jsx)

### Workflow: Viewing Active Cases
1. Navigate to **Active Cases**
2. Cases are displayed in a table with:
   - Case number, deceased name, funeral date
   - Status (color-coded badge)
   - Assigned vehicles/drivers
3. Use filters:
   - **Status filter:** Show only "Intake", "Confirmed", "Scheduled", etc.
   - **Date range filter:** From/To date
   - **Age filter:** "Recent" or "Older"

### Workflow: Opening Case Details
- Click on a **case number** or **deceased name** → Opens the [Case Details](file:///c:/Users/Bongz/Documents/WORK/SYSTEM/tfs_digital/client/src/pages/CaseDetails.jsx) page
- View full case information, audit log, documents, and roster assignments

### Workflow: Changing Case Status
1. Find the case in the list
2. Click the **"Change Status..."** dropdown in the Status column
3. Only **valid next statuses** are shown (system enforces order)
4. Select the new status → **Confirm** the change
5. Status badge updates with new color

### Workflow: Batch Trip Sheet Printing
1. Select multiple cases using checkboxes
2. Click **"Print Trip Sheets"**
3. System generates a combined PDF with trip sheets for all selected cases

---

## 5. Case Status Workflow / Lifecycle

> **Who:** Admin Officer, Branch Manager

### The 8 Status Stages

```
Intake → Confirmed → In Preparation → Scheduled → In Progress → Completed → Archived
   ↓         ↓
Cancelled  Cancelled
```

| Status | When to Use | Color | Next Actions |
|--------|-------------|-------|--------------|
| **Intake** | New case, just started | Gray | → Confirmed or Cancelled |
| **Confirmed** | Payment received, details verified | Blue | → In Preparation or Cancelled |
| **In Preparation** | Arranging coffin, tent, chairs | Yellow | → Scheduled (or back to Confirmed) |
| **Scheduled** | Everything ready, date set | Purple | → In Progress (or back to In Preparation) |
| **In Progress** | Funeral day, service happening | Orange | → Completed |
| **Completed** | Service finished | Green | → Archived |
| **Archived** | Case fully closed | Slate | (Final) |
| **Cancelled** | Service cancelled | Red | (Final) |

### Automatic Smart Suggestions
The system auto-suggests status changes:
- **Funeral is today** + "Scheduled" → Suggests **"In Progress"**
- **Funeral was yesterday** + "In Progress" → Suggests **"Completed"**
- **Funeral 7+ days ago** + "Completed" → Suggests **"Archived"**
- **Funeral within 2 days** + "Confirmed" → Suggests **"In Preparation"**
- **Funeral within 1 day** + "In Preparation" → Suggests **"Scheduled"**

### Real-World Example
| Day | Action | Status |
|-----|--------|--------|
| Monday | Client walks in, create case | **Intake** |
| Monday | Payment received, details confirmed | **Confirmed** |
| Tue–Thu | Preparing coffin, tent, etc. | **In Preparation** |
| Friday | Everything ready, vehicles assigned | **Scheduled** |
| Saturday AM | Funeral service starts | **In Progress** |
| Saturday PM | Service completed | **Completed** |
| Next week | Follow-up done, close case | **Archived** |

---

## 6. Vehicle & Driver Assignment

> **Who:** Fleet Manager, Branch Manager  
> **File:** [AssignVehicleModal.jsx](file:///c:/Users/Bongz/Documents/WORK/SYSTEM/tfs_digital/client/src/components/AssignVehicleModal.jsx)

### Workflow: Assigning a Vehicle to a Case
1. In **Active Cases** or **Case Details**, click **"Assign Vehicle"**
2. The modal opens showing:
   - Available vehicles (filtered by time conflicts)
   - Available drivers
3. Select a **vehicle type** (Fortuner, Vito, V Class, Truck, Q7, Hilux)
4. Select a **specific vehicle**
5. Select a **driver** from the driver list
6. Set the **service time**
7. Optionally add a **group name** (e.g., "Hearse", "Family Car")
8. Click **Assign** → Vehicle appears in the case's transport list

### Time-Based Conflict Detection
**Important:** The system uses a **2-hour buffer** for conflict detection. A vehicle assigned to a 9:00 AM service becomes available again from 11:00 AM onwards.

- The system **only shows available vehicles** — those without time conflicts
- Same vehicle can serve **multiple funerals on the same day** if times don't overlap
- If a conflict exists, the system shows a **detailed error message**

### Workflow: Editing/Removing a Vehicle Assignment
1. In the case's **Assigned Transport List**, find the assignment
2. Click **Edit** (pencil icon) to change vehicle/driver/time
3. Click **Remove** (trash icon) to delete the assignment

### Workflow: Viewing the Roster
- Navigate to `/roster` or use the **Vehicle Calendar** on the Dashboard
- See all vehicle and driver assignments across all cases
- Visual calendar shows busy/free vehicles per date

---

## 7. Case Details & Editing

> **Who:** Admin Officer, Branch Manager  
> **Page:** `/cases/:id`  
> **File:** [CaseDetails.jsx](file:///c:/Users/Bongz/Documents/WORK/SYSTEM/tfs_digital/client/src/pages/CaseDetails.jsx)

### Workflow: Viewing Full Case Information
1. Click into any case from **Active Cases** or **Dashboard search**
2. View all sections:
   - Deceased details, next-of-kin
   - Funeral plan and benefits
   - Service date, venue, time
   - Payment info
   - Casket selection (model + color)
   - Transport assignments
   - **Audit log** — every change ever made
   - **Documents** — uploaded files

### Workflow: Editing a Case
1. Click the **"Edit"** button
2. Modify any field:
   - Deceased name, venue, funeral date
   - Casket model → Color options filter automatically based on stock
   - Location
3. Click **Save** → Changes are logged in the audit trail

### Workflow: Uploading Documents
1. In Case Details, scroll to the **Documents** section
2. Click **"Upload Document"**
3. Select a file from your computer
4. Document is attached to the case record

### Workflow: Viewing Audit Log
- Every status change, edit, vehicle assignment, and document upload is recorded
- Scroll to **"Audit Log"** to see the full history with timestamps and user info

---

## 8. Stock Management / Inventory

> **Who:** Asset Manager, Stock Officer, Branch Manager  
> **Page:** `/stock`  
> **File:** [StockManagement.jsx](file:///c:/Users/Bongz/Documents/WORK/SYSTEM/tfs_digital/client/src/pages/StockManagement.jsx)

### Workflow: Viewing Inventory
1. Navigate to **Stock Management**
2. View all items with:
   - Item name, model, color, SKU
   - Stock quantity, location
   - Low stock status (highlighted)
3. **Filter by category tabs**: All, Coffins, Tents, Chairs, Groceries, etc.
4. **Search** by item name

### Workflow: Adding a New Inventory Item
1. Click **"Add Item"**
2. Fill in:
   - Name, category, SKU
   - Stock quantity, unit price
   - Low stock threshold (alerts when stock drops below this)
   - Location (Makeneng, Head Office, etc.)
   - Model, color
3. Click **Save**

### Workflow: Manual Stock Adjustment
1. Find the item in the inventory list
2. Click **Edit** or the stock quantity
3. Adjust the quantity (up or down)
4. System logs the adjustment as a **stock movement**

### Workflow: Stock Take (Physical Count)
1. Click **"Stock Take"** button
2. The [StockTakeModal](file:///c:/Users/Bongz/Documents/WORK/SYSTEM/tfs_digital/client/src/components/StockTake) opens
3. For each item, enter the **physical count** found on the shelf
4. System compares physical count vs. system quantity
5. **Variances** are highlighted (over/under)
6. Confirm → System adjusts stock and records the variance
7. Full **audit trail** maintained for all discrepancies

### Workflow: Downloading Stock Report PDF
1. Click **"Download PDF"**
2. System generates a branded PDF report including:
   - All items with quantities, locations, and status
   - Total items count, total stock units
   - Low stock item count
   - Company branding and timestamp

---

## 9. Stock Transfers (Between Locations)

> **Who:** Admin Officer, Asset Manager, Stock Officer, Branch Manager  
> **Page:** `/stock-transfers`  
> **File:** [StockTransfers.jsx](file:///c:/Users/Bongz/Documents/WORK/SYSTEM/tfs_digital/client/src/pages/StockTransfers.jsx)

### Transfer Status Flow
```
Pending → Dispatched → Received
    ↓
 Cancelled
```

### Workflow: Creating a Stock Transfer
1. Navigate to **Stock Transfers**
2. Click **"New Transfer"**
3. Select:
   - **From location** (e.g., Makeneng)
   - **To location** (e.g., Head Office)
   - **Driver** for transport
4. Add items:
   - Select inventory item from dropdown
   - Enter quantity to transfer
   - Click **Add Item** (can add multiple items)
5. Add optional **notes**
6. Click **Submit** → Transfer created as **"Pending"**

### Workflow: Dispatching a Transfer
1. Go to **Pending** tab
2. Find the transfer
3. Click **"Dispatch"** → Status changes to **"Dispatched"**
4. Driver takes items to destination

### Workflow: Receiving a Transfer
1. Go to **Dispatched** tab
2. Find the arriving transfer
3. Click **"Receive"** → Status changes to **"Received"**
4. System automatically:
   - **Decreases** stock at the source location
   - **Increases** stock at the destination location

### Workflow: Printing a Gate Pass
1. Click the **print icon** on any transfer
2. A [TransferGatePass](file:///c:/Users/Bongz/Documents/WORK/SYSTEM/tfs_digital/client/src/components/TransferGatePass.jsx) is generated
3. Print for the driver to carry as proof of transfer

### Workflow: Editing/Cancelling a Transfer
- **Edit:** Click pencil icon on a pending transfer to modify items/quantities
- **Cancel:** Click cancel on a pending transfer → Status becomes "Cancelled"
- Only **pending** transfers can be edited or cancelled

---

## 10. Purchase Orders & Procurement

> **Who:** Directors  
> **Page:** `/purchase`  
> **Files:** [PurchaseOrders components](file:///c:/Users/Bongz/Documents/WORK/SYSTEM/tfs_digital/client/src/components/PurchaseOrders)

### PO Status Flow
```
Draft → Sent → Partial → Received
  ↓
Cancelled
```

### Workflow: Creating a Purchase Order
1. Navigate to **Purchase Orders**
2. Click **"New Purchase Order"**
3. Select **Supplier** from dropdown (by name)
4. Set **Order Date** and **Expected Delivery Date**
5. Add line items:
   - Select item from inventory dropdown
   - System auto-fills **suggested price** from inventory
   - Enter **quantity to order**
   - System shows **current stock** for reference
   - Override price if needed
6. Click **Create PO** → Status is **"Draft"**

### Workflow: Sending a PO to Supplier
1. Find the Draft PO in the list
2. Click **"Send to Supplier"**
3. System **emails the PO** to the supplier automatically:
   - Professional HTML-formatted email
   - Includes item descriptions, SKUs, quantities, prices
   - Delivery instructions and payment terms
   - Company branding
4. A copy is sent to admin for records
5. PO status changes to **"Sent"**

**Warning:** Once a PO is "Sent", it **cannot be edited or deleted**. Make sure all details are correct before sending.

### Workflow: Editing/Deleting a Draft PO
- Only **Draft** POs can be modified
- Click **Edit** to change items, quantities, or prices
- Click **Delete** to remove the PO entirely

---

## 11. GRV — Goods Received Voucher

> **Who:** Directors  
> **Triggered from:** Purchase Orders page

### Workflow: Receiving Goods (Full or Partial)
1. Find a PO with status **"Sent"** or **"Partial"**
2. Click **"Receive GRV"**
3. For each line item, enter the **quantity received**
4. Enter **"Received by"** name
5. Click **Process GRV**

### What Happens Automatically:
- **Inventory stock quantities are updated** (increased by received amount)
- **Stock movement record** created for audit
- **PO status updates:**
  - If ALL items fully received → Status becomes **"Received"**
  - If SOME items received → Status becomes **"Partial"**
- Each line item tracks **quantity_received** vs **quantity_ordered**

### Partial Receiving
- You can receive goods in **multiple batches**
- Example: Ordered 10 caskets, receive 6 now → Status: **"Partial"**
- Later receive remaining 4 → Status: **"Received"**
- System tracks cumulative received quantities

---

## 12. Repatriation Trip Sheets

> **Who:** Admin Officer, Fleet Manager  
> **Page:** `/repatriation-trip`  
> **File:** [RepatriationTripSheet.jsx](file:///c:/Users/Bongz/Documents/WORK/SYSTEM/tfs_digital/client/src/pages/RepatriationTripSheet.jsx)

### Workflow: Creating a Trip Sheet
1. Navigate to **Repatriation Trip**
2. Fill in the form:
   - **Deceased:** Name, ID number, policy number
   - **Date of death**
   - **Family contact:** Name and phone number
   - **Route:** From location/address → To location/address
   - **Vehicle:** Select from dropdown
   - **Driver:** Select from dropdown
   - **Odometer:** Closing reading (system remembers last closing for continuity)
   - **Times:** Time out and time in
   - **Collection type** and **Tag number**
3. Click **Save** → Trip is recorded

### Workflow: Printing a Trip Sheet
1. After filling in the form, click **"Print"**
2. System switches to print-friendly layout
3. Browser print dialog opens
4. Print for driver records / filing

**Note:** The system automatically remembers the **last closing odometer reading** so the next trip starts from the correct mileage.

---

## 13. Airtime Requests

> **Who:** Claims Officer, Managing Director  
> **Page:** `/airtime-requests`  
> **File:** [AirtimeRequests.jsx](file:///c:/Users/Bongz/Documents/WORK/SYSTEM/tfs_digital/client/src/pages/AirtimeRequests.jsx)

### Context
When a funeral plan includes airtime (Plans A through F), the system automatically creates an **airtime request** when the case is submitted.

### Workflow: Managing Airtime Requests
1. Navigate to **Airtime Requests**
2. View list of pending airtime requests (linked to cases)
3. Toggle between **Active** (recent) and **Archived** (older than 12 days)
4. Filter by status if needed

### Workflow: Updating Request Status
1. Click on a request → Modal opens
2. Select new status (e.g., "Sent", "Completed")
3. **Add a note** (required) — e.g., "Airtime sent via MTN"
4. Click **Submit** → Status updates

### Workflow: Viewing Request Notes
- Click the **notes icon** on any request
- View the history of operator notes

---

## 14. WhatsApp Chats

> **Who:** Enquiries Department  
> **Page:** `/whatsapp`  
> **File:** [WhatsAppChat.jsx](file:///c:/Users/Bongz/Documents/WORK/SYSTEM/tfs_digital/client/src/pages/WhatsAppChat.jsx)

### Workflow: Using the Chat System
1. Navigate to **Chats**
2. View conversations in the left panel
3. Select a conversation → Messages appear in the right panel
4. Type and send messages
5. System integrates with WhatsApp for client communication

---

## 15. Media Studio

> **Who:** IT, Marketing *(still under development)*  
> **Page:** `/media-studio`  
> **File:** [MediaStudio.jsx](file:///c:/Users/Bongz/Documents/WORK/SYSTEM/tfs_digital/client/src/pages/MediaStudio.jsx)

**Note:** This module is **still under development**. Full training will be provided once complete.

### Workflow: Creating Media Content
1. Navigate to **Media Studio**
2. Use the tools to create:
   - Funeral programmes
   - Marketing materials
   - Branded content
3. Save or export created media

---

## 16. User Management (Admin Only)

> **Who:** IT, Managing Director  
> **Page:** `/users`  
> **File:** [UserManagement.jsx](file:///c:/Users/Bongz/Documents/WORK/SYSTEM/tfs_digital/client/src/pages/UserManagement.jsx)

**Important:** This section is only visible to users with **admin** role.

### Workflow: Creating a New User
1. Navigate to **Users**
2. Click **"Add User"**
3. Fill in:
   - **Email** (used for login)
   - **Password** (min 6 characters)
   - **Full name**
   - **Phone number**
   - **Role:** Staff, Manager, or Admin
4. Click **Create** → User can immediately sign in

### Workflow: Managing Existing Users
- **Change role:** Click role dropdown → Select new role
- **Activate/Deactivate:** Toggle user status (inactive users cannot sign in)
- **Delete:** Remove user entirely (use with caution)

### Organisational Roles & System Access

| Role | Primary Modules |
|------|----------------|
| **Claims Officer** | Intake, Airtime Requests |
| **Admin Officer** | Intake, Active Cases, Case Status, Case Details, Stock Transfers, Repatriation |
| **Branch Manager** | Dashboard, Active Cases, Case Status, Case Details, Vehicle Assignment, Stock Management, Stock Transfers, Reports, Trip Sheets |
| **Fleet Manager** | Active Cases, Vehicle & Driver Assignment, Repatriation, Trip Sheets |
| **Asset Manager** | Stock Management, Stock Transfers, Reports |
| **Stock Officer** | Stock Management, Stock Transfers, Reports |
| **Directors** | Purchase Orders, GRV |
| **Managing Director** | Airtime Requests, User Management |
| **Enquiries Department** | WhatsApp Chats |
| **IT** | Media Studio, User Management |
| **Marketing** | Media Studio |

---

## 17. Reports & PDF Generation

> **Who:** Asset Manager, Stock Officer, Branch Manager

### Stock Report PDF
- **Where:** Stock Management → "Download PDF"
- **Contains:** All inventory with quantities, locations, status
- **Branding:** Company logo, red header, professional layout

### Driver Trip Sheets
- **Where:** Active Cases → select cases → "Print Trip Sheets"
- **Contains:** Driver name, vehicle, route, deceased details, times

### Gate Pass
- **Where:** Stock Transfers → click print icon
- **Contains:** Transfer items, quantities, from/to locations, driver

### Repatriation Trip Sheet
- **Where:** Repatriation Trip page → "Print"
- **Contains:** Full trip details, odometer, times, deceased info

---

## 18. Driver Trip Sheets & Batch Printing

> **Who:** Fleet Manager, Branch Manager  
> **File:** [DriverTripSheet.jsx](file:///c:/Users/Bongz/Documents/WORK/SYSTEM/tfs_digital/client/src/components/DriverTripSheet.jsx)

### Workflow: Printing Individual Trip Sheets
1. In **Case Details** or **Active Cases**
2. Click the **print icon** next to a vehicle assignment
3. Trip sheet generates with:
   - Driver and vehicle details
   - Deceased name and case number
   - Venue and service time
   - Route information

### Workflow: Batch Printing
1. In **Active Cases**, check the **checkbox** next to multiple cases
2. Click **"Print Batch Trip Sheets"**
3. System generates all trip sheets in one print job
4. Each case gets a separate page

---

## Quick Navigation Map

| Task | Where to Go |
|------|------------|
| New family consultation | **Intake** (Home `/`) |
| Daily overview & alerts | **Dashboard** (`/dashboard`) |
| Track case progress | **Active Cases** (`/active-cases`) |
| Assign vehicles/drivers | **Active Cases** → Select case → Assign |
| View vehicle schedule | **Dashboard** → Calendar or **Roster** |
| Check/adjust inventory | **Stock Management** (`/stock`) |
| Move stock between locations | **Stock Transfers** (`/stock-transfers`) |
| Re-order supplies | **Purchase Orders** (`/purchase`) |
| Receive delivered goods | **Purchase Orders** → GRV |
| Physical inventory count | **Stock Management** → Stock Take |
| Log a body collection trip | **Repatriation Trip** (`/repatriation-trip`) |
| Process airtime benefits | **Airtime Requests** (`/airtime-requests`) |
| Manage users & roles | **Users** (`/users`) — Admin only |

---

## Common Mistakes to Avoid

**Training emphasis — discuss these with staff:**

1. **Don't skip status updates** — Keep cases current for accurate Dashboard reporting
2. **Don't send a PO before reviewing** — Once sent, it cannot be edited
3. **Always do GRV when goods arrive** — Stock quantities won't update until you process a GRV
4. **Check vehicle availability before assigning** — The system prevents double-bookings, but check the calendar first
5. **Update stock after physical counts** — Use Stock Take, don't manually edit quantities
6. **Don't share login credentials** — Each user should have their own account
7. **Save drafts frequently** — Don't lose intake work; use the Save Draft button
8. **Complete repatriation trip sheets** — Required for odometer tracking and fleet records

---

## System Access Points

| Environment | URL |
|-------------|-----|
| **Local Development** | `http://localhost:3000` (client) / `http://localhost:5000` (API) |
| **Production** | Deployed on Render |

### Tech Stack Reference
- **Frontend:** React (Create React App)
- **Backend:** Node.js / Express
- **Database:** PostgreSQL via Supabase
- **Email:** SMTP (Gmail) for PO dispatch
- **Auth:** Supabase Auth with JWT tokens

---

*Document generated for TFS Digital training week — 18 August 2026*
