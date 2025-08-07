# GharBazaar System Flowcharts (Graphviz DOT Format)

## 1. User Registration & Authentication Flowchart

```dot
digraph UserAuth {
    rankdir=TD;
    node [shape=box, style=rounded];
    decision [shape=diamond];

    A [label="User visits website"];
    B [label="User authenticated?", shape=diamond];
    C [label="Redirect to Dashboard"];
    D [label="Show Homepage"];
    E [label="User clicks Login/Signup"];
    F [label="Display Auth Form"];
    G [label="Select Login or Signup", shape=diamond];
    H [label="Enter: Name, Email, Password"];
    I [label="Enter: Email, Password"];
    J [label="Validate signup form"];
    K [label="Validate login form"];
    L [label="Form valid?", shape=diamond];
    M [label="Form valid?", shape=diamond];
    N [label="Show validation errors"];
    O [label="Send signup request to server"];
    P [label="Send login request to server"];
    Q [label="User already exists?", shape=diamond];
    R [label="Show 'User exists' error"];
    S [label="Hash password & create user"];
    T [label="Valid credentials?", shape=diamond];
    U [label="Show 'Invalid credentials' error"];
    V [label="Generate JWT token"];
    W [label="Generate JWT token"];
    X [label="Send token to client"];
    Y [label="Store token in localStorage"];
    Z [label="Redirect to Dashboard"];

    A -> B;
    B -> C [label="Yes"];
    B -> D [label="No"];
    D -> E;
    E -> F;
    F -> G;
    G -> H [label="Signup"];
    G -> I [label="Login"];
    H -> J;
    I -> K;
    J -> L;
    K -> M;
    L -> N [label="No"];
    M -> N [label="No"];
    N -> F;
    L -> O [label="Yes"];
    M -> P [label="Yes"];
    O -> Q;
    Q -> R [label="Yes"];
    R -> F;
    Q -> S [label="No"];
    P -> T;
    T -> U [label="No"];
    U -> F;
    T -> V [label="Yes"];
    S -> W;
    V -> X;
    W -> X;
    X -> Y;
    Y -> Z;
    Z -> C;
}
```

## 2. Property Search & Filter Flowchart

```dot
digraph PropertySearch {
    rankdir=TD;
    node [shape=box, style=rounded];

    A [label="User enters homepage"];
    B [label="Display recent listings"];
    C [label="User action", shape=diamond];
    D [label="Enter search query"];
    E [label="Navigate to filter page"];
    F [label="Redirect to filter page with query"];
    G [label="Display filter options & search results"];
    H [label="User applies filters?", shape=diamond];
    I [label="Show all properties"];
    J [label="User selects filters"];
    K [label="Property Type: Room/Flat/House/Land"];
    L [label="Purpose: Rent/Buy/Sell"];
    M [label="Price Range: Min-Max"];
    N [label="Location filter"];
    O [label="Apply filters button"];
    P [label="Build query with filters"];
    Q [label="Send request to backend"];
    R [label="Execute database query"];
    S [label="Return filtered results"];
    T [label="Display filtered properties"];
    U [label="Send request for all properties"];
    V [label="Return all properties"];
    W [label="Display all properties"];
    X [label="User clicks property?", shape=diamond];
    Y [label="Navigate to property detail"];
    Z [label="Stay on filter page"];

    A -> B;
    B -> C;
    C -> D [label="Search in hero"];
    C -> E [label="Click Properties menu"];
    C -> E [label="Click View all"];
    D -> F;
    F -> E;
    E -> G;
    G -> H;
    H -> I [label="No"];
    H -> J [label="Yes"];
    J -> K;
    K -> L;
    L -> M;
    M -> N;
    N -> O;
    O -> P;
    P -> Q;
    Q -> R;
    R -> S;
    S -> T;
    I -> U;
    U -> V;
    V -> W;
    T -> X;
    W -> X;
    X -> Y [label="Yes"];
    X -> Z [label="No"];
    Z -> H;
}
```

## 3. Property Detail & Messaging Flowchart

```dot
digraph PropertyDetail {
    rankdir=TD;
    node [shape=box, style=rounded];

    A [label="User clicks on property"];
    B [label="Navigate to property detail page"];
    C [label="Fetch property data from server"];
    D [label="Property found?", shape=diamond];
    E [label="Show 'Property not found' error"];
    F [label="Display property information"];
    G [label="Show property images"];
    H [label="Show property details"];
    I [label="Show location on map"];
    J [label="Show owner contact info"];
    K [label="User actions", shape=diamond];
    L [label="Navigate through image gallery"];
    M [label="User authenticated?", shape=diamond];
    N [label="User authenticated?", shape=diamond];
    O [label="Return to previous page"];
    P [label="End"];
    Q [label="Redirect to login page"];
    R [label="After login, return to property"];
    S [label="Open message modal"];
    T [label="Fill message form"];
    U [label="Subject, Message content"];
    V [label="Send message?", shape=diamond];
    W [label="Close modal"];
    X [label="Send message to server"];
    Y [label="Save message in database"];
    Z [label="Show success notification"];
    AA [label="Add to favorites list"];
    BB [label="Update favorites in database"];
    CC [label="Show success notification"];

    A -> B;
    B -> C;
    C -> D;
    D -> E [label="No"];
    D -> F [label="Yes"];
    F -> G;
    G -> H;
    H -> I;
    I -> J;
    J -> K;
    K -> L [label="Browse images"];
    K -> M [label="Send message"];
    K -> N [label="Add to favorites"];
    K -> O [label="Go back"];
    L -> K;
    O -> P;
    M -> Q [label="No"];
    N -> Q [label="No"];
    Q -> R;
    R -> F;
    M -> S [label="Yes"];
    S -> T;
    T -> U;
    U -> V;
    V -> W [label="No"];
    V -> X [label="Yes"];
    X -> Y;
    Y -> Z;
    Z -> W;
    W -> K;
    N -> AA [label="Yes"];
    AA -> BB;
    BB -> CC;
    CC -> K;
}
```

## 4. Property Management (Add/Edit) Flowchart

```dot
digraph PropertyManagement {
    rankdir=TD;
    node [shape=box, style=rounded];

    A [label="User in dashboard"];
    B [label="Click 'Add Property' or 'Edit Property'"];
    C [label="Action type", shape=diamond];
    D [label="Show empty property form"];
    E [label="Fetch existing property data"];
    F [label="Populate form with existing data"];
    G [label="Show populated form"];
    H [label="User fills/modifies form"];
    I [label="Property Title"];
    J [label="Description"];
    K [label="Property Type dropdown"];
    L [label="Purpose dropdown"];
    M [label="Price input"];
    N [label="Location input"];
    O [label="Area input"];
    P [label="Phone number input"];
    Q [label="Upload/modify images"];
    R [label="Form submission", shape=diamond];
    S [label="Discard changes"];
    T [label="Validate form data"];
    U [label="Validation passed?", shape=diamond];
    V [label="Show validation errors"];
    W [label="Process uploaded images"];
    X [label="Resize and optimize images"];
    Y [label="Save images to server"];
    Z [label="Create image metadata"];
    AA [label="Add or Edit?", shape=diamond];
    BB [label="Insert new property to database"];
    CC [label="Update existing property in database"];
    DD [label="Property created successfully"];
    EE [label="Property updated successfully"];
    FF [label="Show success message"];
    GG [label="Redirect to 'My Listings'"];
    HH [label="Return to dashboard"];
    II [label="End"];

    A -> B;
    B -> C;
    C -> D [label="Add"];
    C -> E [label="Edit"];
    E -> F;
    F -> G;
    D -> G;
    G -> H;
    H -> I;
    I -> J;
    J -> K;
    K -> L;
    L -> M;
    M -> N;
    N -> O;
    O -> P;
    P -> Q;
    Q -> R;
    R -> S [label="Cancel"];
    R -> T [label="Submit"];
    T -> U;
    U -> V [label="No"];
    V -> H;
    U -> W [label="Yes"];
    W -> X;
    X -> Y;
    Y -> Z;
    Z -> AA;
    AA -> BB [label="Add"];
    AA -> CC [label="Edit"];
    BB -> DD;
    CC -> EE;
    DD -> FF;
    EE -> FF;
    FF -> GG;
    S -> HH;
    GG -> HH;
    HH -> II;
}
```

## 5. User Dashboard Navigation Flowchart

```dot
digraph UserDashboard {
    rankdir=TD;
    node [shape=box, style=rounded];

    A [label="User logs in"];
    B [label="Dashboard loads"];
    C [label="Display user stats"];
    D [label="Show recent activities"];
    E [label="Display navigation menu"];
    F [label="User selects menu item", shape=diamond];
    G [label="Load profile page"];
    H [label="Load user's properties"];
    I [label="Load add property form"];
    J [label="Load saved favorites"];
    K [label="Load message inbox"];
    L [label="Load settings page"];
    M [label="Clear authentication"];
    N [label="Show/Edit profile information"];
    O [label="Save changes?", shape=diamond];
    P [label="Update profile in database"];
    Q [label="Discard changes"];
    R [label="Show success message"];
    S [label="Display user's properties list"];
    T [label="Property actions", shape=diamond];
    U [label="Load edit property form"];
    V [label="Confirm deletion"];
    W [label="Go to property detail"];
    X [label="Edit property flow"];
    Y [label="Confirm delete?", shape=diamond];
    Z [label="Delete from database"];
    AA [label="Remove property"];
    BB [label="Property detail page"];
    CC [label="Add property flow"];
    DD [label="Display saved favorites"];
    EE [label="Favorite actions", shape=diamond];
    FF [label="Go to property detail"];
    GG [label="Remove from favorites"];
    HH [label="Display message list"];
    II [label="Message actions", shape=diamond];
    JJ [label="Open message"];
    KK [label="Compose reply"];
    LL [label="Mark as read"];
    MM [label="Send reply"];
    NN [label="Display settings options"];
    OO [label="Setting changes", shape=diamond];
    PP [label="Change password"];
    QQ [label="Update preferences"];
    RR [label="Validate & update"];
    SS [label="Remove token from storage"];
    TT [label="Redirect to homepage"];
    UU [label="End session"];

    A -> B;
    B -> C;
    C -> D;
    D -> E;
    E -> F;
    F -> G [label="My Profile"];
    F -> H [label="My Listings"];
    F -> I [label="Add Property"];
    F -> J [label="Favorites"];
    F -> K [label="Messages"];
    F -> L [label="Settings"];
    F -> M [label="Logout"];

    G -> N;
    N -> O;
    O -> P [label="Yes"];
    O -> Q [label="No"];
    P -> R;
    Q -> E;
    R -> E;

    H -> S;
    S -> T;
    T -> U [label="Edit"];
    T -> V [label="Delete"];
    T -> W [label="View"];
    U -> X;
    V -> Y;
    Y -> Z [label="Yes"];
    Y -> S [label="No"];
    Z -> AA;
    AA -> S;
    W -> BB;

    I -> CC;

    J -> DD;
    DD -> EE;
    EE -> FF [label="View"];
    EE -> GG [label="Remove"];
    FF -> BB;
    GG -> DD;

    K -> HH;
    HH -> II;
    II -> JJ [label="Read"];
    II -> KK [label="Reply"];
    JJ -> LL;
    KK -> MM;
    LL -> HH;
    MM -> HH;

    L -> NN;
    NN -> OO;
    OO -> PP [label="Password"];
    OO -> QQ [label="Notifications"];
    PP -> RR;
    QQ -> RR;
    RR -> NN;

    M -> SS;
    SS -> TT;
    TT -> UU;
}
```

## 6. Message System Flowchart

```dot
digraph MessageSystem {
    rankdir=TD;
    node [shape=box, style=rounded];

    // Sender side
    A [label="User wants to contact property owner"];
    B [label="User authenticated?", shape=diamond];
    C [label="Redirect to login"];
    D [label="Open message form"];
    E [label="After login, return to property"];
    F [label="Pre-fill recipient & property info"];
    G [label="User enters subject & message"];
    H [label="Send message?", shape=diamond];
    I [label="Close form"];
    J [label="Validate message content"];
    K [label="Validation OK?", shape=diamond];
    L [label="Show validation errors"];
    M [label="Send to message API"];
    N [label="Check sender authentication"];
    O [label="Auth valid?", shape=diamond];
    P [label="Return auth error"];
    Q [label="Insert message in database"];
    R [label="Message saved successfully"];
    S [label="Send notification to receiver"];
    T [label="Return success to sender"];
    U [label="Show success message"];
    V [label="Close message form"];
    QQ [label="End"];

    // Recipient side
    W [label="Owner logs in"];
    X [label="Goes to messages page"];
    Y [label="Fetch unread messages"];
    Z [label="Display message list"];
    AA [label="Highlight unread messages"];
    BB [label="User clicks message", shape=diamond];
    CC [label="Open message detail"];
    DD [label="Stay in inbox"];
    EE [label="Mark message as read"];
    FF [label="Display message content"];
    GG [label="Reply to message?", shape=diamond];
    HH [label="Close message"];
    II [label="Open reply form"];
    JJ [label="Pre-fill reply fields"];
    KK [label="User types reply"];
    LL [label="Send reply"];
    MM [label="Save reply to database"];
    NN [label="Notify original sender"];
    OO [label="Show success message"];
    PP [label="Return to inbox"];

    // Sender flow
    A -> B;
    B -> C [label="No"];
    B -> D [label="Yes"];
    C -> E;
    E -> D;
    D -> F;
    F -> G;
    G -> H;
    H -> I [label="No"];
    H -> J [label="Yes"];
    J -> K;
    K -> L [label="No"];
    L -> G;
    K -> M [label="Yes"];
    M -> N;
    N -> O;
    O -> P [label="No"];
    O -> Q [label="Yes"];
    Q -> R;
    R -> S;
    S -> T;
    T -> U;
    U -> V;
    V -> QQ;
    I -> QQ;
    P -> QQ;

    // Recipient flow
    W -> X;
    X -> Y;
    Y -> Z;
    Z -> AA;
    AA -> BB;
    BB -> CC [label="Yes"];
    BB -> DD [label="No"];
    CC -> EE;
    EE -> FF;
    FF -> GG;
    GG -> HH [label="No"];
    GG -> II [label="Yes"];
    II -> JJ;
    JJ -> KK;
    KK -> LL;
    LL -> MM;
    MM -> NN;
    NN -> OO;
    OO -> PP;
    HH -> DD;
    PP -> DD;
}
```

## 7. File Upload Flowchart

```dot
digraph FileUpload {
    rankdir=TD;
    node [shape=box, style=rounded];

    A [label="User adds/edits property"];
    B [label="Property form loads"];
    C [label="Image upload section displayed"];
    D [label="User action", shape=diamond];
    E [label="Open file picker"];
    F [label="Handle drag & drop event"];
    G [label="User selects image files"];
    H [label="Get dropped files"];
    I [label="Validate file types"];
    J [label="Valid image files?", shape=diamond];
    K [label="Show file type error"];
    L [label="Check file sizes"];
    M [label="Files under size limit?", shape=diamond];
    N [label="Show file size error"];
    O [label="Display image previews"];
    P [label="Add to upload queue"];
    Q [label="More images to add?", shape=diamond];
    R [label="User submits form"];
    S [label="Prepare form data with images"];
    T [label="Send multipart request"];
    U [label="Server receives upload"];
    V [label="Validate uploaded files"];
    W [label="Files valid on server?", shape=diamond];
    X [label="Return upload error"];
    Y [label="Process each image"];
    Z [label="Show error to user"];
    AA [label="Generate unique filename"];
    BB [label="Resize/optimize image"];
    CC [label="Save to uploads directory"];
    DD [label="Create image metadata"];
    EE [label="More images to process?", shape=diamond];
    FF [label="Save property with image paths"];
    GG [label="Return success response"];
    HH [label="Show success to user"];
    II [label="Allow user to retry"];
    JJ [label="Redirect to listings"];
    KK [label="End"];

    A -> B;
    B -> C;
    C -> D;
    D -> E [label="Select files"];
    D -> F [label="Drag & drop"];
    E -> G;
    F -> H;
    G -> I;
    H -> I;
    I -> J;
    J -> K [label="No"];
    J -> L [label="Yes"];
    K -> C;
    L -> M;
    M -> N [label="No"];
    M -> O [label="Yes"];
    N -> C;
    O -> P;
    P -> Q;
    Q -> C [label="Yes"];
    Q -> R [label="No"];
    R -> S;
    S -> T;
    T -> U;
    U -> V;
    V -> W;
    W -> X [label="No"];
    W -> Y [label="Yes"];
    X -> Z;
    Y -> AA;
    AA -> BB;
    BB -> CC;
    CC -> DD;
    DD -> EE;
    EE -> Y [label="Yes"];
    EE -> FF [label="No"];
    FF -> GG;
    GG -> HH;
    Z -> II;
    II -> C;
    HH -> JJ;
    JJ -> KK;
}
```

## 8. Application Startup Flowchart

```dot
digraph ApplicationStartup {
    rankdir=TD;
    node [shape=box, style=rounded];

    // Backend startup
    A [label="Application starts"];
    B [label="Load environment variables"];
    C [label="Initialize Express app"];
    D [label="Setup middleware"];
    E [label="CORS configuration"];
    F [label="JSON body parser"];
    G [label="Static file serving"];
    H [label="Setup database connection"];
    I [label="Database connection successful?", shape=diamond];
    J [label="Log database error"];
    K [label="Run database setup script"];
    L [label="Exit application"];
    M [label="Create tables if not exist"];
    N [label="Setup authentication routes"];
    O [label="Setup property routes"];
    P [label="Setup message routes"];
    Q [label="Setup file upload handling"];
    R [label="Start server on port"];
    S [label="Server started successfully?", shape=diamond];
    T [label="Log server error"];
    U [label="Log success message"];
    V [label="Server ready for requests"];
    W [label="Frontend can connect"];
    X [label="Application ready"];

    // Frontend initialization
    Y [label="Browser loads page"];
    Z [label="Load React app"];
    AA [label="Initialize React Router"];
    BB [label="Check user authentication"];
    CC [label="Token exists in localStorage?", shape=diamond];
    DD [label="Validate token"];
    EE [label="Show homepage as guest"];
    FF [label="Token valid?", shape=diamond];
    GG [label="Set user state"];
    HH [label="Clear invalid token"];
    II [label="Show authenticated UI"];
    JJ [label="App ready for user"];

    // Backend flow
    A -> B;
    B -> C;
    C -> D;
    D -> E;
    E -> F;
    F -> G;
    G -> H;
    H -> I;
    I -> J [label="No"];
    I -> K [label="Yes"];
    J -> L;
    K -> M;
    M -> N;
    N -> O;
    O -> P;
    P -> Q;
    Q -> R;
    R -> S;
    S -> T [label="No"];
    S -> U [label="Yes"];
    T -> L;
    U -> V;
    V -> W;
    W -> X;

    // Frontend flow
    X -> Y;
    Y -> Z;
    Z -> AA;
    AA -> BB;
    BB -> CC;
    CC -> DD [label="Yes"];
    CC -> EE [label="No"];
    DD -> FF;
    FF -> GG [label="Yes"];
    FF -> HH [label="No"];
    GG -> II;
    HH -> EE;
    II -> JJ;
    EE -> JJ;
}
```

## Usage Instructions

To use these Graphviz DOT files:

1. **Install Graphviz**: Download from https://graphviz.org/download/
2. **Command line usage**:

   ```bash
   # Generate PNG
   dot -Tpng flowchart.dot -o flowchart.png

   # Generate SVG
   dot -Tsvg flowchart.dot -o flowchart.svg

   # Generate PDF
   dot -Tpdf flowchart.dot -o flowchart.pdf
   ```

3. **Online tools**: You can also use online Graphviz renderers like:

   - https://dreampuf.github.io/GraphvizOnline/
   - https://magjac.com/graphviz-visual-editor/

4. **VS Code extension**: Install "Graphviz (dot) language support" extension for syntax highlighting and preview.

## Customization Options

You can customize the appearance by modifying these attributes:

- `node [shape=box, style=rounded, color=blue, fillcolor=lightblue, style="filled,rounded"]`
- `edge [color=red, style=dashed]`
- `rankdir=LR` for left-to-right layout instead of top-to-bottom
- `bgcolor=white` for background color
