# K-FRAME API Contract

This document defines the public boundary between the web application and the future private K-FRAME intelligence layer.

The contract is intentionally stable while the internal scoring and inference implementation remains private and replaceable.

## Base path

`/api/v1`

## Authentication

Production requests should use an authenticated tenant session or a short-lived bearer token. Every request must resolve to a tenant and an authorized user before assessment or evidence data is returned.

## Create assessment

### `POST /assessments`

Creates a new assessment.

Example request:

```json
{
  "organization": "Example Organization",
  "scope": {
    "type": "business_unit",
    "name": "Operations"
  },
  "responses": {
    "criticalKnowledgeConcentration": 4,
    "secondaryOwnership": 2,
    "evidenceFreshness": 3,
    "decisionTraceability": 2,
    "sourceConsistency": 3,
    "transferReadiness": 2,
    "accessContinuity": 4,
    "aiProvenanceReadiness": 2
  }
}
```

Example response:

```json
{
  "assessmentId": "asmt_01",
  "status": "draft",
  "createdAt": "2026-09-17T13:00:00Z"
}
```

## Run assessment

### `POST /assessments/{assessmentId}/analyze`

Requests the private engine to calculate the K-FRAME outputs for the current assessment state.

Example response:

```json
{
  "assessmentId": "asmt_01",
  "modelVersion": "1.0.0",
  "scores": {
    "fragility": 71,
    "resilience": 42,
    "assurance": 58,
    "memory": 39,
    "evidence": 54,
    "decisionReproducibility": 41,
    "aiKnowledgeReadiness": 46
  },
  "classification": "material-exposure",
  "topDrivers": [],
  "recommendedActions": []
}
```

The exact scoring logic is not part of the public contract.

## Submit evidence metadata

### `POST /assessments/{assessmentId}/evidence`

Registers approved evidence and its metadata. Upload transport can use a pre-signed private storage URL so the API does not need to proxy large files.

Example metadata:

```json
{
  "title": "Operations escalation procedure",
  "sourceType": "procedure",
  "owner": "Operations",
  "authority": "approved",
  "effectiveDate": "2026-05-01",
  "reviewDate": "2027-05-01",
  "confidentiality": "internal"
}
```

## Create knowledge objects

### `POST /assessments/{assessmentId}/knowledge-units`

Creates or imports normalized knowledge objects and their relationships.

Required production fields should include:

- stable object identifier;
- title and description;
- criticality;
- owner;
- source lineage;
- freshness or review state;
- confidentiality;
- related people, systems, decisions and processes.

## Run shock simulation

### `POST /assessments/{assessmentId}/shocks`

Example request:

```json
{
  "shockType": "key_person_unavailable",
  "targetId": "role_finance_controller",
  "parameters": {
    "durationDays": 60
  }
}
```

Example response:

```json
{
  "shockId": "shock_01",
  "affectedKnowledgeUnits": 12,
  "affectedProcesses": 4,
  "affectedDecisions": 7,
  "lossRadius": 68,
  "criticalBreakpoints": [],
  "recommendedActions": []
}
```

## Retrieve report

### `GET /assessments/{assessmentId}/report`

Returns the current report model for the web interface or an authorized export service.

The report should preserve the distinction between:

- evidence-backed findings;
- self-reported findings;
- inferred findings;
- unresolved contradictions.

## Query organizational knowledge

### `POST /knowledge/query`

This future endpoint can support evidence-grounded questions against the organization knowledge graph.

A production answer should include source identifiers, confidence and access checks. When sufficient evidence is unavailable, the system should return an explicit insufficiency state rather than fabricate an answer.

## Versioning

Every material output should return a `modelVersion`. Historical reports must remain associated with the model version that generated them so changes in calibration can be reconstructed.
