```mermaid
erDiagram
    USER {
        int user_id PK
        string full_name
        string email
        string auth_provider_id
    }
    
    PROMPT {
        int prompt_id PK
        int user_id FK
        string content
        string status
        datetime created_at
    }
    
    IMAGE {
        int image_id PK
        int prompt_id FK
        string file_path
        string metadata
        datetime created_at
    }
    
    ORDER {
        int order_id PK
        int user_id FK
        string status
        float total_price
        string shipping_address
        datetime created_at
    }
    
    PRINTJOB {
        int print_job_id PK
        int order_id FK
        int image_id FK
        string print_status
        datetime created_at
    }
    
    PAYMENT {
        int payment_id PK
        int order_id FK
        int user_id FK
        float amount
        string currency
        string payment_status
        datetime created_at
    }
    
    TOKENTRANSACTION {
        int transaction_id PK
        int user_id FK
        string type
        int token_amount
        string description
        datetime created_at
    }

    USER ||--o{ PROMPT : "creates"
    USER ||--o{ ORDER : "places"
    USER ||--o{ TOKENTRANSACTION : "has"
    PROMPT ||--o{ IMAGE : "generates"
    ORDER ||--o{ PRINTJOB : "includes"
    ORDER ||--o| PAYMENT : "is_paid_with"
    PRINTJOB ||--|{ IMAGE : "prints"
    