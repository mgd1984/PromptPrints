```mermaid
flowchart TD
    subgraph User Interaction
        UI[Next.js Web Interface] --> Prompt[User Prompt]
        UI --> Auth[Authentication]
        Prompt --> Generation[Image Generation]
    end
    
    subgraph Print Server
        Auth --> CUPS[(CUPS Print Server)]
        Generation --> Image[Image Processing]
        Image --> Upscale[Image Upscale]
        Upscale --> CUPS
        CUPS --> Printer1[Canon Pro 1000 #1]
        CUPS --> Printer2[Canon Pro 1000 #2]
    end
    
    subgraph Cloud Services
        CUPS --> Cloudflare[Cloudflare Tunnel]
        Auth --> Netlify[Netlify Identity]
        Payments --> Square[Square API]
    end
    
    subgraph Backend Services
        UI --> API[Next.js Backend API]
        API --> DB[(Database)]
        API --> JWT[JWT Token Management]
        API --> Payments[Payment Processing]
    end
    
    Cloudflare --> UI
    Netlify --> UI
    DB --> UI
    Square --> UI