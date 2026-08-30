# 🏗️ System Architecture & Engineering Blueprint

## 1. Ecosystem Overview
The **SIH26043 Platform** is a multi-tier, AI-orchestrated innovation pipeline consisting of:
1. **Client Edge**: Flutter Mobile App for Citizen voice/photo geo-reporting.
2. **Unified Web Frontend**: Single React SPA with Role-Based Access Control (RBAC) routing for Ministries, Universities, and Corporate CSR.
3. **Core Intelligence Backend**: Flask REST API coupled with 5 specialized AI/NLP evaluation and matchmaking modules.
4. **Cloud & State**: Cloud Firestore with atomic transactions and rule-guarded collections.

```mermaid
flowchart TD
    subgraph Citizens
        C[Flutter Mobile App]
    end

    subgraph Core API & AI
        B[Flask REST API Server]
        AI1[NLP Classifier]
        AI2[Deduplicator Engine]
        AI3[Severity Prioritizer]
        AI4[University Department Matcher]
        AI5[Industry CSR Matcher]
    end

    subgraph Single Domain Web Portal
        W[Unified React SPA]
        G[Government Portal /government/*]
        U[University Portal /university/*]
        I[Industry Portal /industry/*]
    end

    C -->|Grievances + Evidence| B
    B --> AI1 & AI2 & AI3
    AI1 & AI2 & AI3 --> B
    B --> AI4 & AI5
    
    W -->|JWT Authenticated Session| B
    W --> G
    W --> U
    W --> I
```
