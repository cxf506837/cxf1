# Architecture

`AI OrderOps Workbench` is a sanitized portfolio demo of an AI-assisted order processing system.

```mermaid
flowchart LR
  A["PDF / ZIP upload"] --> B["Text extraction"]
  B --> C["Order recognition"]
  C --> D["SKU and rule engine"]
  D --> E["Field adjudication"]
  E --> F["Quality checks"]
  F --> G["Excel export"]
  F --> H["Review queue"]
  H --> I["Candidate rules"]
  I --> D
```

The demo deliberately separates deterministic evidence from AI assistance. A field is released only when it has a traceable source from PDF text, SKU master data, or a confirmed rule. Uncertain fields are routed to review.

