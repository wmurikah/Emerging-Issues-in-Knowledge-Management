# K-FRAME Model

**K-FRAME** stands for **Knowledge Fragility, Resilience, Assurance, Memory and Evidence**.

It is the applied model that converts the research in this repository into an operational knowledge-risk and knowledge-intelligence system.

## The problem K-FRAME is designed to solve

Most knowledge-management assessments ask whether an organization has a strategy, a repository, governance, technology, measures and knowledge-sharing practices. Those questions are useful, but they do not directly answer what happens when organizational knowledge is stressed.

K-FRAME starts with a different question:

> If a person, system, source, assumption or document disappeared today, which decisions and processes would become unavailable, untrustworthy or impossible to reproduce?

The model treats organizational knowledge as a network of dependencies rather than a collection of documents.

## Core objects

A production implementation can represent the following as graph objects:

- **Knowledge unit:** a critical fact, rule, judgement, exception, method, relationship or piece of know-how.
- **Decision:** an important choice and the rationale, evidence and authority behind it.
- **Process:** an operational activity that consumes or produces knowledge.
- **Person or role:** a holder, creator, validator or user of knowledge.
- **System:** an application, repository or technical dependency.
- **Evidence:** a document, record, transaction, message, policy, dataset or source supporting a knowledge claim.
- **Control:** a rule or safeguard governing access, quality, validation, retention or use.

## Core relationships

The graph is designed around relationships such as:

- `HELD_BY`
- `EVIDENCED_BY`
- `DEPENDS_ON`
- `USED_BY`
- `CREATED_BY`
- `VALIDATED_BY`
- `SUPERSEDES`
- `CONTRADICTS`
- `REQUIRED_FOR`
- `TRANSFERRED_TO`

## Five analytical lenses

### 1. Fragility

Measures how easily important knowledge can be lost, blocked or degraded. Typical signals include concentration in one person, missing documentation, inaccessible sources, undocumented exceptions and lack of a secondary owner.

### 2. Resilience

Measures whether knowledge-dependent work can continue after disruption. The model considers redundancy, transfer readiness, alternative sources, recovery time and whether another authorized person could act with equivalent context.

### 3. Assurance

Measures whether a claim or decision is supported by current, authoritative and traceable evidence. The model distinguishes between evidence-backed knowledge, self-reported knowledge and inference.

### 4. Memory

Measures whether an organization can reconstruct why a decision was made, what assumptions existed, what changed later and what lessons should persist.

### 5. Evidence

Measures the traceability, freshness, authority and consistency of the sources used by people and AI systems.

## Distinctive analytical outputs

K-FRAME is designed to produce more than a maturity score.

### Knowledge Fragility Index

A relative measure of how exposed a knowledge unit is to loss or degradation.

### Decision Reproducibility Score

Estimates whether an authorized successor could recreate a decision using the evidence and context available today.

### Knowledge Trust Score

Estimates whether the underlying sources are current, authoritative, consistent and traceable.

### AI Knowledge Readiness Score

Estimates whether a knowledge unit is suitable for retrieval or reasoning by an AI system without creating avoidable provenance, access or staleness risk.

### Knowledge Loss Radius

Shows which processes, decisions and downstream knowledge objects become impaired when a dependency fails.

## Knowledge Shock Simulator

The production engine is intended to run controlled counterfactual scenarios against the knowledge graph. Example shocks include:

1. A critical expert becomes unavailable.
2. A primary repository becomes inaccessible.
3. A policy or procedure becomes stale.
4. Two authoritative sources contradict each other.
5. A key process loses its secondary owner.
6. AI is asked to answer using incomplete or weakly sourced knowledge.
7. A business unit changes system, structure or operating model.

The engine then estimates the affected knowledge units, decisions and processes and ranks interventions according to expected risk reduction.

## Intervention logic

Recommendations should be linked to the specific failure mode rather than generated as generic best practice. Examples include:

- capture a targeted expert interview for one undocumented decision pattern;
- assign and validate a secondary knowledge owner;
- create a source-of-truth record for a contradictory rule;
- add evidence lineage to an AI-retrievable knowledge object;
- retire stale duplicates;
- create a decision record for a high-impact exception;
- restrict AI retrieval where evidence quality is below threshold;
- create a transfer exercise and test whether a successor can reproduce the decision.

## Public and private boundary

This public repository contains the research model, data contract and demonstration interface. It intentionally does **not** contain the future production scoring weights, graph inference rules, calibration data, private prompts, model routing logic or recommendation ranking algorithms.

Those components should live in a private service and be exposed only through an authenticated API. This allows the public research to remain reproducible while preserving the commercial intelligence layer.

See:

- [`ARCHITECTURE.md`](ARCHITECTURE.md)
- [`API-CONTRACT.md`](API-CONTRACT.md)
- [`PRODUCTION-BOUNDARY.md`](PRODUCTION-BOUNDARY.md)
- [`assessment.schema.json`](assessment.schema.json)

## Prototype

The public browser prototype is located at [`../docs/k-frame/`](../docs/k-frame/). It uses an intentionally simplified demonstration heuristic. It is not the proposed production scoring engine.
