# GharBazaar UML Diagrams

## 1. System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        WB[Web Browser]
        MB[Mobile Browser]
    end

    subgraph "Frontend Layer"
        FE[React Frontend<br/>- Vite Build<br/>- React Router<br/>- CSS Modules]
    end

    subgraph "Backend Layer"
        API[Express.js API<br/>- RESTful endpoints<br/>- JWT Authentication<br/>- File upload handling]
        MW[Middleware<br/>- Auth middleware<br/>- Upload middleware]
    end

    subgraph "Database Layer"
        DB[(MySQL Database<br/>- Users<br/>- Listings<br/>- Messages<br/>- Ratings)]
    end

    subgraph "File Storage"
        FS[File System<br/>Property Images]
    end

    WB --> FE
    MB --> FE
    FE --> API
    API --> MW
    MW --> DB
    API --> FS
```

## 2. Database Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ LISTINGS : owns
    USERS ||--o{ MESSAGES : sends
    USERS ||--o{ MESSAGES : receives
    USERS ||--o{ RATINGS : gives
    USERS ||--o{ REPORTS : reports
    USERS ||--o{ SEARCH_LOGS : searches

    LISTINGS ||--o{ MESSAGES : about
    LISTINGS ||--o{ RATINGS : receives
    LISTINGS ||--o{ REPORTS : reported

    USERS {
        int id PK
        varchar name
        varchar email UK
        varchar password
        enum role
        datetime created_at
    }

    LISTINGS {
        int id PK
        int user_id FK
        varchar title
        text description
        enum property_type
        enum purpose
        decimal price
        varchar location
        varchar area
        varchar phone_number
        text images
        decimal latitude
        decimal longitude
        datetime created_at
    }

    MESSAGES {
        int id PK
        int sender_id FK
        int receiver_id FK
        int listing_id FK
        varchar subject
        text message
        boolean is_read
        datetime created_at
    }

    RATINGS {
        int id PK
        int listing_id FK
        int user_id FK
        tinyint rating
        datetime created_at
    }

    REPORTS {
        int id PK
        int reporter_id FK
        int reported_user_id FK
        int reported_listing_id FK
        text reason
        enum status
        datetime created_at
    }

    SEARCH_LOGS {
        int id PK
        int user_id FK
        text query
        datetime searched_at
    }
```

## 3. Class Diagram - Backend Components

```mermaid
classDiagram
    class ExpressApp {
        +express app
        +port: number
        +cors()
        +json()
        +static()
        +listen()
        +setupRoutes()
    }

    class DatabaseConfig {
        +pool: Pool
        +testConnection()
        +setupDatabase()
    }

    class AuthMiddleware {
        +authenticateToken(req, res, next)
        +verifyJWT(token)
    }

    class UploadMiddleware {
        +multer storage
        +fileFilter()
        +upload.array()
    }

    class UserController {
        +signup(req, res)
        +login(req, res)
        +getProfile(req, res)
        +updateProfile(req, res)
    }

    class PropertyController {
        +getAllProperties(req, res)
        +getPropertyById(req, res)
        +createProperty(req, res)
        +updateProperty(req, res)
        +deleteProperty(req, res)
        +getUserProperties(req, res)
        +searchProperties(req, res)
    }

    class MessageController {
        +sendMessage(req, res)
        +getMessages(req, res)
        +markAsRead(req, res)
    }

    ExpressApp --> DatabaseConfig
    ExpressApp --> AuthMiddleware
    ExpressApp --> UploadMiddleware
    ExpressApp --> UserController
    ExpressApp --> PropertyController
    ExpressApp --> MessageController
```

## 4. Class Diagram - Frontend Components

```mermaid
classDiagram
    class App {
        +BrowserRouter
        +Routes[]
        +ProtectedRoute
    }

    class HomePage {
        +searchQuery: string
        +recentListings: array
        +user: object
        +fetchRecentListings()
        +handleSearch()
        +render()
    }

    class PropertyDetail {
        +property: object
        +currentImageIndex: number
        +loading: boolean
        +fetchProperty()
        +handleImageNavigation()
        +render()
    }

    class UserDashboard {
        +user: object
        +stats: object
        +activities: array
        +fetchUserData()
        +render()
    }

    class AddProperty {
        +formData: object
        +images: array
        +handleSubmit()
        +handleImageUpload()
        +validateForm()
        +render()
    }

    class FilterPage {
        +properties: array
        +filters: object
        +pagination: object
        +fetchProperties()
        +applyFilters()
        +handleFilterChange()
        +render()
    }

    class Navbar {
        +user: object
        +isLoggedIn: boolean
        +isMobile: boolean
        +handleAuth()
        +handleLogout()
        +render()
    }

    class ProtectedRoute {
        +children: component
        +checkAuth()
        +redirect()
    }

    class SendMessage {
        +messageData: object
        +sendMessage()
        +handleSubmit()
        +render()
    }

    App --> HomePage
    App --> PropertyDetail
    App --> UserDashboard
    App --> AddProperty
    App --> FilterPage
    App --> ProtectedRoute

    HomePage --> Navbar
    PropertyDetail --> Navbar
    PropertyDetail --> SendMessage
    UserDashboard --> Navbar
    AddProperty --> Navbar
    FilterPage --> Navbar
```

## 5. Sequence Diagram - User Registration Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth API
    participant DB as Database

    U->>F: Enter registration details
    F->>F: Validate form data
    F->>A: POST /api/auth/signup
    A->>A: Validate input
    A->>DB: Check if user exists
    DB-->>A: User not found
    A->>A: Hash password
    A->>DB: INSERT new user
    DB-->>A: User created successfully
    A->>A: Generate JWT token
    A-->>F: Return success + token
    F->>F: Store token in localStorage
    F-->>U: Redirect to dashboard
```

## 6. Sequence Diagram - Property Search Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant P as Properties API
    participant DB as Database

    U->>F: Enter search criteria
    F->>F: Build query parameters
    F->>P: GET /api/properties?filters
    P->>DB: Execute search query
    DB-->>P: Return matching properties
    P->>P: Format response data
    P-->>F: Return properties list
    F->>F: Update UI with results
    F-->>U: Display search results

    U->>F: Click on property
    F->>P: GET /api/properties/:id
    P->>DB: Fetch property details
    DB-->>P: Return property data
    P-->>F: Return property details
    F-->>U: Display property detail page
```

## 7. Sequence Diagram - Message System Flow

```mermaid
sequenceDiagram
    participant U1 as User 1
    participant F as Frontend
    participant M as Messages API
    participant DB as Database
    participant U2 as User 2

    U1->>F: Click "Send Message"
    F->>F: Open message modal
    U1->>F: Enter message details
    F->>M: POST /api/messages/send
    M->>M: Verify authentication
    M->>DB: INSERT message
    DB-->>M: Message saved
    M-->>F: Success response
    F-->>U1: Show success notification

    Note over U2: When User 2 logs in
    U2->>F: Navigate to messages
    F->>M: GET /api/messages
    M->>DB: Fetch user messages
    DB-->>M: Return messages
    M-->>F: Return messages list
    F-->>U2: Display messages
```

## 8. Component Interaction Diagram

```mermaid
graph TD
    subgraph "Authentication Flow"
        LOGIN[Login/Signup Page] --> AUTH{Authentication}
        AUTH -->|Success| DASHBOARD[User Dashboard]
        AUTH -->|Failure| LOGIN
    end

    subgraph "Property Management"
        DASHBOARD --> ADDPROP[Add Property]
        DASHBOARD --> MYLIST[My Listings]
        DASHBOARD --> EDIT[Edit Property]
        ADDPROP --> UPLOAD[Image Upload]
        EDIT --> UPDATE[Update Property]
    end

    subgraph "Property Discovery"
        HOME[Homepage] --> SEARCH[Search/Filter]
        SEARCH --> RESULTS[Property Results]
        RESULTS --> DETAIL[Property Detail]
        DETAIL --> CONTACT[Send Message]
    end

    subgraph "User Features"
        DASHBOARD --> PROFILE[Edit Profile]
        DASHBOARD --> MESSAGES[View Messages]
        DASHBOARD --> FAVORITES[Favorites]
        DETAIL --> FAV[Add to Favorites]
    end

    HOME --> LOGIN
    SEARCH --> LOGIN
    DETAIL --> LOGIN
```

## 9. State Management Diagram

```mermaid
stateDiagram-v2
    [*] --> Unauthenticated

    Unauthenticated --> Authenticating: Login/Signup
    Authenticating --> Authenticated: Success
    Authenticating --> Unauthenticated: Failure

    Authenticated --> ViewingProperties: Browse Properties
    Authenticated --> ManagingProfile: Edit Profile
    Authenticated --> ManagingListings: Manage Properties
    Authenticated --> ViewingMessages: Check Messages

    ViewingProperties --> ViewingPropertyDetail: Select Property
    ViewingPropertyDetail --> SendingMessage: Send Message
    ViewingPropertyDetail --> ViewingProperties: Back to List

    ManagingListings --> AddingProperty: Add New
    ManagingListings --> EditingProperty: Edit Existing
    AddingProperty --> ManagingListings: Save/Cancel
    EditingProperty --> ManagingListings: Save/Cancel

    ViewingMessages --> ReadingMessage: Open Message
    ReadingMessage --> ReplyingMessage: Reply
    ReplyingMessage --> ViewingMessages: Send/Cancel

    Authenticated --> Unauthenticated: Logout
```
