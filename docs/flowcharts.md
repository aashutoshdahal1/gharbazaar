# GharBazaar System Flowcharts

## 1. User Registration & Authentication Flowchart

```mermaid
flowchart TD
    A[User visits website] --> B{User authenticated?}
    B -->|Yes| C[Redirect to Dashboard]
    B -->|No| D[Show Homepage]

    D --> E[User clicks Login/Signup]
    E --> F[Display Auth Form]
    F --> G{Select Login or Signup}

    G -->|Signup| H[Enter: Name, Email, Password]
    G -->|Login| I[Enter: Email, Password]

    H --> J[Validate signup form]
    I --> K[Validate login form]

    J --> L{Form valid?}
    K --> M{Form valid?}

    L -->|No| N[Show validation errors]
    M -->|No| N
    N --> F

    L -->|Yes| O[Send signup request to server]
    M -->|Yes| P[Send login request to server]

    O --> Q{User already exists?}
    Q -->|Yes| R[Show "User exists" error]
    R --> F
    Q -->|No| S[Hash password & create user]

    P --> T{Valid credentials?}
    T -->|No| U[Show "Invalid credentials" error]
    U --> F
    T -->|Yes| V[Generate JWT token]

    S --> W[Generate JWT token]
    V --> X[Send token to client]
    W --> X

    X --> Y[Store token in localStorage]
    Y --> Z[Redirect to Dashboard]
    Z --> C
```

## 2. Property Search & Filter Flowchart

```mermaid
flowchart TD
    A[User enters homepage] --> B[Display recent listings]
    B --> C{User action}

    C -->|Search in hero| D[Enter search query]
    C -->|Click Properties menu| E[Navigate to filter page]
    C -->|Click "View all"| E

    D --> F[Redirect to filter page with query]
    F --> E

    E --> G[Display filter options & search results]
    G --> H{User applies filters?}

    H -->|No| I[Show all properties]
    H -->|Yes| J[User selects filters]

    J --> K[Property Type: Room/Flat/House/Land]
    K --> L[Purpose: Rent/Buy/Sell]
    L --> M[Price Range: Min-Max]
    M --> N[Location filter]
    N --> O[Apply filters button]

    O --> P[Build query with filters]
    P --> Q[Send request to backend]
    Q --> R[Execute database query]
    R --> S[Return filtered results]
    S --> T[Display filtered properties]

    I --> U[Send request for all properties]
    U --> V[Return all properties]
    V --> W[Display all properties]

    T --> X{User clicks property?}
    W --> X
    X -->|Yes| Y[Navigate to property detail]
    X -->|No| Z[Stay on filter page]
    Z --> H
```

## 3. Property Detail & Messaging Flowchart

```mermaid
flowchart TD
    A[User clicks on property] --> B[Navigate to property detail page]
    B --> C[Fetch property data from server]
    C --> D{Property found?}

    D -->|No| E[Show "Property not found" error]
    D -->|Yes| F[Display property information]

    F --> G[Show property images]
    G --> H[Show property details]
    H --> I[Show location on map]
    I --> J[Show owner contact info]

    J --> K{User actions}
    K -->|Browse images| L[Navigate through image gallery]
    K -->|Send message| M{User authenticated?}
    K -->|Add to favorites| N{User authenticated?}
    K -->|Go back| O[Return to previous page]

    L --> K
    O --> P[End]

    M -->|No| Q[Redirect to login page]
    N -->|No| Q
    Q --> R[After login, return to property]
    R --> F

    M -->|Yes| S[Open message modal]
    S --> T[Fill message form]
    T --> U[Subject, Message content]
    U --> V{Send message?}
    V -->|No| W[Close modal]
    V -->|Yes| X[Send message to server]

    X --> Y[Save message in database]
    Y --> Z[Show success notification]
    Z --> W
    W --> K

    N -->|Yes| AA[Add to favorites list]
    AA --> BB[Update favorites in database]
    BB --> CC[Show success notification]
    CC --> K
```

## 4. Property Management (Add/Edit) Flowchart

```mermaid
flowchart TD
    A[User in dashboard] --> B[Click "Add Property" or "Edit Property"]
    B --> C{Action type}

    C -->|Add| D[Show empty property form]
    C -->|Edit| E[Fetch existing property data]
    E --> F[Populate form with existing data]
    F --> G[Show populated form]
    D --> G

    G --> H[User fills/modifies form]
    H --> I[Property Title]
    I --> J[Description]
    J --> K[Property Type dropdown]
    K --> L[Purpose dropdown]
    L --> M[Price input]
    M --> N[Location input]
    N --> O[Area input]
    O --> P[Phone number input]
    P --> Q[Upload/modify images]

    Q --> R{Form submission}
    R -->|Cancel| S[Discard changes]
    R -->|Submit| T[Validate form data]

    T --> U{Validation passed?}
    U -->|No| V[Show validation errors]
    V --> H

    U -->|Yes| W[Process uploaded images]
    W --> X[Resize and optimize images]
    X --> Y[Save images to server]
    Y --> Z[Create image metadata]

    Z --> AA{Add or Edit?}
    AA -->|Add| BB[Insert new property to database]
    AA -->|Edit| CC[Update existing property in database]

    BB --> DD[Property created successfully]
    CC --> EE[Property updated successfully]

    DD --> FF[Show success message]
    EE --> FF
    FF --> GG[Redirect to "My Listings"]

    S --> HH[Return to dashboard]
    GG --> HH
    HH --> II[End]
```

## 5. User Dashboard Navigation Flowchart

```mermaid
flowchart TD
    A[User logs in] --> B[Dashboard loads]
    B --> C[Display user stats]
    C --> D[Show recent activities]
    D --> E[Display navigation menu]

    E --> F{User selects menu item}
    F -->|My Profile| G[Load profile page]
    F -->|My Listings| H[Load user's properties]
    F -->|Add Property| I[Load add property form]
    F -->|Favorites| J[Load saved favorites]
    F -->|Messages| K[Load message inbox]
    F -->|Settings| L[Load settings page]
    F -->|Logout| M[Clear authentication]

    G --> N[Show/Edit profile information]
    N --> O{Save changes?}
    O -->|Yes| P[Update profile in database]
    O -->|No| Q[Discard changes]
    P --> R[Show success message]
    Q --> E
    R --> E

    H --> S[Display user's properties list]
    S --> T{Property actions}
    T -->|Edit| U[Load edit property form]
    T -->|Delete| V[Confirm deletion]
    T -->|View| W[Go to property detail]

    U --> X[Edit property flow]
    V --> Y{Confirm delete?}
    Y -->|Yes| Z[Delete from database]
    Y -->|No| S
    Z --> AA[Remove property]
    AA --> S
    W --> BB[Property detail page]

    I --> CC[Add property flow]

    J --> DD[Display saved favorites]
    DD --> EE{Favorite actions}
    EE -->|View| FF[Go to property detail]
    EE -->|Remove| GG[Remove from favorites]
    FF --> BB
    GG --> DD

    K --> HH[Display message list]
    HH --> II{Message actions}
    II -->|Read| JJ[Open message]
    II -->|Reply| KK[Compose reply]
    JJ --> LL[Mark as read]
    KK --> MM[Send reply]
    LL --> HH
    MM --> HH

    L --> NN[Display settings options]
    NN --> OO{Setting changes}
    OO -->|Password| PP[Change password]
    OO -->|Notifications| QQ[Update preferences]
    PP --> RR[Validate & update]
    QQ --> RR
    RR --> NN

    M --> SS[Remove token from storage]
    SS --> TT[Redirect to homepage]
    TT --> UU[End session]
```

## 6. Message System Flowchart

```mermaid
flowchart TD
    A[User wants to contact property owner] --> B{User authenticated?}
    B -->|No| C[Redirect to login]
    B -->|Yes| D[Open message form]

    C --> E[After login, return to property]
    E --> D

    D --> F[Pre-fill recipient & property info]
    F --> G[User enters subject & message]
    G --> H{Send message?}

    H -->|No| I[Close form]
    H -->|Yes| J[Validate message content]

    J --> K{Validation OK?}
    K -->|No| L[Show validation errors]
    L --> G

    K -->|Yes| M[Send to message API]
    M --> N[Check sender authentication]
    N --> O{Auth valid?}

    O -->|No| P[Return auth error]
    O -->|Yes| Q[Insert message in database]

    Q --> R[Message saved successfully]
    R --> S[Send notification to receiver]
    S --> T[Return success to sender]
    T --> U[Show success message]
    U --> V[Close message form]

    subgraph "Recipient Side"
        W[Owner logs in] --> X[Goes to messages page]
        X --> Y[Fetch unread messages]
        Y --> Z[Display message list]
        Z --> AA[Highlight unread messages]
        AA --> BB{User clicks message}
        BB -->|Yes| CC[Open message detail]
        BB -->|No| DD[Stay in inbox]

        CC --> EE[Mark message as read]
        EE --> FF[Display message content]
        FF --> GG{Reply to message?}
        GG -->|No| HH[Close message]
        GG -->|Yes| II[Open reply form]

        II --> JJ[Pre-fill reply fields]
        JJ --> KK[User types reply]
        KK --> LL[Send reply]
        LL --> MM[Save reply to database]
        MM --> NN[Notify original sender]
        NN --> OO[Show success message]
        OO --> PP[Return to inbox]

        HH --> DD
        PP --> DD
    end

    V --> QQ[End]
    I --> QQ
    P --> QQ
```

## 7. File Upload Flowchart

```mermaid
flowchart TD
    A[User adds/edits property] --> B[Property form loads]
    B --> C[Image upload section displayed]
    C --> D{User action}

    D -->|Select files| E[Open file picker]
    D -->|Drag & drop| F[Handle drag & drop event]

    E --> G[User selects image files]
    F --> H[Get dropped files]
    G --> I[Validate file types]
    H --> I

    I --> J{Valid image files?}
    J -->|No| K[Show file type error]
    J -->|Yes| L[Check file sizes]

    K --> C
    L --> M{Files under size limit?}
    M -->|No| N[Show file size error]
    M -->|Yes| O[Display image previews]

    N --> C
    O --> P[Add to upload queue]
    P --> Q{More images to add?}
    Q -->|Yes| C
    Q -->|No| R[User submits form]

    R --> S[Prepare form data with images]
    S --> T[Send multipart request]
    T --> U[Server receives upload]

    U --> V[Validate uploaded files]
    V --> W{Files valid on server?}
    W -->|No| X[Return upload error]
    W -->|Yes| Y[Process each image]

    X --> Z[Show error to user]
    Y --> AA[Generate unique filename]
    AA --> BB[Resize/optimize image]
    BB --> CC[Save to uploads directory]
    CC --> DD[Create image metadata]
    DD --> EE{More images to process?}

    EE -->|Yes| Y
    EE -->|No| FF[Save property with image paths]
    FF --> GG[Return success response]
    GG --> HH[Show success to user]

    Z --> II[Allow user to retry]
    II --> C
    HH --> JJ[Redirect to listings]
    JJ --> KK[End]
```

## 8. Application Startup Flowchart

```mermaid
flowchart TD
    A[Application starts] --> B[Load environment variables]
    B --> C[Initialize Express app]
    C --> D[Setup middleware]
    D --> E[CORS configuration]
    E --> F[JSON body parser]
    F --> G[Static file serving]
    G --> H[Setup database connection]

    H --> I{Database connection successful?}
    I -->|No| J[Log database error]
    I -->|Yes| K[Run database setup script]

    J --> L[Exit application]
    K --> M[Create tables if not exist]
    M --> N[Setup authentication routes]
    N --> O[Setup property routes]
    O --> P[Setup message routes]
    P --> Q[Setup file upload handling]

    Q --> R[Start server on port]
    R --> S{Server started successfully?}
    S -->|No| T[Log server error]
    S -->|Yes| U[Log success message]

    T --> L
    U --> V[Server ready for requests]
    V --> W[Frontend can connect]
    W --> X[Application ready]

    subgraph "Frontend Initialization"
        Y[Browser loads page] --> Z[Load React app]
        Z --> AA[Initialize React Router]
        AA --> BB[Check user authentication]
        BB --> CC{Token exists in localStorage?}
        CC -->|Yes| DD[Validate token]
        CC -->|No| EE[Show homepage as guest]
        DD --> FF{Token valid?}
        FF -->|Yes| GG[Set user state]
        FF -->|No| HH[Clear invalid token]
        GG --> II[Show authenticated UI]
        HH --> EE
        II --> JJ[App ready for user]
        EE --> JJ
    end

    X --> Y
```
