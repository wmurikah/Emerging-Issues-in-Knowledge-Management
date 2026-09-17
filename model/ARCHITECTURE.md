# K-FRAME Production Architecture

## Design goal

K-FRAME should be deployable as a secure web application on a dedicated subdomain while keeping the core analytical logic private.

A suitable future deployment could use a subdomain such as:

`knowledge.murikah.com`

or

`kframe.murikah.com`

The public research repository can continue to explain the method and host a demonstration interface, while the production system runs as a separate application.

## Proposed architecture

```text
User browser
    |
    v
Web application
    |
    +--> Authentication and tenant context
    |
    v
K-FRAME API gateway
    |
    +--> Assessment service
    +--> Evidence ingestion service
    +--> Knowledge graph service
    +--> Shock simulation service
    +--> Recommendation service
    +--> Reporting service
    |
    v
Private intelligence layer
    |
    +--> Proprietary scoring model
    +--> Graph inference rules
    +--> Evidence quality model
    +--> Decision reproducibility model
    +--> Recommendation ranking
    +--> Private prompts and model routing
    |
    +--> Relational database
    +--> Graph database
    +--> Object storage
    +--> Vector index, only where useful
```

## Why a graph is central

The research problem is relational. A document can be current but still represent a knowledge risk if only one person understands how to apply it. A person can be highly experienced but still represent a continuity risk if no successor can reproduce the decisions they make. A procedure can be well documented but still be unreliable if it depends on an inaccessible system or contradicts another authoritative source.

A graph allows the system to answer questions such as:

- Which critical processes depend on one person?
- Which decisions depend on evidence that is stale or contradictory?
- Which knowledge units have no validated secondary owner?
- Which downstream activities are affected if one system is unavailable?
- Which AI-retrievable sources lack provenance or access classification?
- Which decisions cannot be reconstructed from surviving evidence?

## Suggested technology choices

The production stack is intentionally implementation-neutral, but a practical deployment could use:

- **Frontend:** Next.js or another modern server-rendered web framework.
- **API:** TypeScript, Python or a mixed service architecture.
- **Primary database:** PostgreSQL for tenants, users, assessments and configuration.
- **Graph database:** Neo4j, Memgraph or PostgreSQL with a graph-oriented extension.
- **Object storage:** S3-compatible private storage for approved evidence files.
- **AI layer:** model-provider abstraction with retrieval, source controls and output validation.
- **Authentication:** enterprise SSO plus role-based access control.
- **Observability:** immutable audit events for ingestion, scoring changes, approvals and reports.

## Core workflow

### 1. Scope

The user defines an organization, business unit, process, role or knowledge domain to assess.

### 2. Ingest

The system accepts structured answers and, in later versions, approved organizational evidence such as policies, procedures, decision records, handover notes, process maps, repositories and selected system exports.

### 3. Normalize

Evidence is converted into normalized objects with source, owner, date, authority, confidentiality and lifecycle attributes.

### 4. Build the knowledge dependency graph

The engine connects knowledge units to people, systems, decisions, processes and evidence.

### 5. Assess

The private engine calculates fragility, resilience, assurance, memory, evidence and derived scores.

### 6. Stress test

The shock simulator removes or degrades selected dependencies and calculates the resulting knowledge-loss radius.

### 7. Recommend

The intervention engine ranks actions according to the expected reduction in critical exposure, effort and dependency depth.

### 8. Verify

The organization can rerun the same shock after remediation to test whether resilience actually improved.

## Security principles

A production version should follow these design rules:

1. Tenant isolation by default.
2. Least-privilege access to every evidence source.
3. No model receives content the user is not authorized to access.
4. Sensitive evidence is not used for model training unless explicitly authorized.
5. Every generated finding identifies whether it is evidence-backed, self-reported or inferred.
6. Every material score change is auditable.
7. Raw evidence can be retained separately from derived graph facts.
8. The system can be configured to use private or region-specific model endpoints where required.

## Multi-tenant commercial deployment

The architecture should support:

- organization-level workspaces;
- multiple assessments per organization;
- role-based assessors, reviewers and administrators;
- versioned scoring models;
- configurable industry overlays;
- exportable executive reports;
- API access for enterprise customers;
- private deployment options for highly regulated customers.

## Product evolution

The public prototype starts with a structured self-assessment. Later phases can add evidence ingestion, graph construction, organization-specific calibration, automatic contradiction detection, decision-chain reconstruction and live knowledge-drift monitoring.
