# K-FRAME Production Boundary

## Purpose

This repository is public. The production K-FRAME intelligence layer should not be implemented here if the commercial method is intended to remain proprietary.

The public repository can contain:

- the research rationale;
- the conceptual model;
- the public data contract;
- the browser demonstration;
- sample or synthetic data;
- the API interface expected by the frontend;
- documentation needed for scholarly review and product discovery.

The production service should keep the following private:

- scoring weights and calibration values;
- graph inference and dependency propagation rules;
- knowledge-loss radius algorithms;
- decision reproducibility logic;
- recommendation ranking logic;
- private prompts and agent instructions;
- model routing and fallback logic;
- customer benchmark data;
- industry calibration packs;
- contradiction-resolution rules;
- fraud, abuse and manipulation detection rules;
- proprietary report-generation logic.

## Recommended repository split

A future commercial implementation should use at least two repositories.

### Public repository

This repository remains the scholarly and demonstration surface.

### Private application repository

Suggested private structure:

```text
kframe-private/
  apps/
    web/
    api/
  services/
    scoring/
    graph/
    evidence/
    shocks/
    recommendations/
    reporting/
  packages/
    domain/
    auth/
    audit/
  calibrations/
  prompts/
  infra/
```

## Deployment boundary

The public browser prototype should eventually call an endpoint such as:

`https://api.kframe.murikah.com/api/v1`

The public frontend should never receive proprietary weights or internal graph rules. It should receive only the final authorized result payload needed for rendering.

## Intellectual-property hygiene

Before commercial deployment:

1. Keep production implementation in a private repository.
2. Use written contributor and contractor IP assignment terms where appropriate.
3. Maintain a dated design and release history.
4. Keep calibration datasets private unless there is a deliberate publication decision.
5. Avoid embedding private prompts or secrets in browser JavaScript.
6. Document third-party dependencies and their licenses.
7. Consider appropriate trademark, copyright, trade-secret and patent advice for the final implementation and naming.

This file describes an engineering boundary. It is not legal advice.
