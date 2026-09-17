const questions = [
  {
    id: "distribution",
    title: "Critical knowledge is distributed across more than one capable owner.",
    help: "A second person or role can act without depending on one individual.",
    action: "Create a validated secondary owner for the most concentrated critical knowledge and test that the backup can perform the work."
  },
  {
    id: "documentation",
    title: "Procedures, exceptions and judgement calls are captured well enough for a successor.",
    help: "Documentation includes the context behind decisions, not only the formal steps.",
    action: "Capture the undocumented decision patterns, exceptions and practical judgement that a successor would otherwise have to rediscover."
  },
  {
    id: "traceability",
    title: "Important decisions can be traced to their rationale, evidence and authority.",
    help: "A reviewer can reconstruct why the decision was made and what supported it.",
    action: "Create decision records for high-impact choices, including rationale, evidence, owner, date and superseding events."
  },
  {
    id: "freshness",
    title: "Critical knowledge has an owner, review date and a reliable stale-content signal.",
    help: "Users can distinguish current guidance from material that needs review.",
    action: "Assign ownership and review dates to critical knowledge, then surface overdue content before it is reused."
  },
  {
    id: "consistency",
    title: "Conflicting sources are detected, resolved and clearly superseded.",
    help: "Users are not left to decide which of two authoritative sources is correct.",
    action: "Establish a contradiction-resolution workflow and mark superseded sources so users and AI systems do not treat them as equally authoritative."
  },
  {
    id: "transfer",
    title: "Knowledge transfer is verified through practice rather than assumed from handover notes.",
    help: "A successor has demonstrated that the knowledge can actually be used.",
    action: "Run a transfer exercise where a successor performs or explains the critical task without assistance, then close the observed gaps."
  },
  {
    id: "access",
    title: "Critical knowledge remains available when the primary repository or system is unavailable.",
    help: "Continuity does not depend entirely on one technical location.",
    action: "Identify critical knowledge that depends on one repository and define a controlled continuity path for temporary system unavailability."
  },
  {
    id: "ai",
    title: "AI tools can trace answers to approved, current and access-controlled sources.",
    help: "AI retrieval is governed by provenance, freshness and authorization.",
    action: "Restrict AI retrieval to approved sources with provenance, freshness and access metadata, and require source-linked answers for high-impact use."
  },
  {
    id: "lessons",
    title: "Incidents, exceptions and lessons learned change future guidance and decisions.",
    help: "Learning becomes organizational memory instead of remaining in meetings or individuals.",
    action: "Connect lessons and incidents to the procedures, controls or decisions they should change, then verify that the update occurred."
  },
  {
    id: "governance",
    title: "Critical knowledge has clear ownership, access classification and lifecycle rules.",
    help: "Responsibility for quality, access, review and retirement is explicit.",
    action: "Define accountable owners and lifecycle rules for the highest-impact knowledge domains before expanding automation or AI use."
  }
];

const shocks = {
  key_person: {
    name: "Key expert unavailable",
    controls: ["distribution", "documentation", "transfer"],
    explanation: "This shock tests how much work depends on knowledge concentrated in a person or small group."
  },
  repository: {
    name: "Repository unavailable",
    controls: ["access", "documentation", "governance"],
    explanation: "This shock tests whether critical knowledge remains usable when the primary knowledge system cannot be reached."
  },
  stale: {
    name: "Evidence becomes stale",
    controls: ["freshness", "traceability", "governance"],
    explanation: "This shock tests whether users can detect and contain outdated knowledge before it drives decisions."
  },
  contradiction: {
    name: "Sources contradict",
    controls: ["consistency", "traceability", "freshness"],
    explanation: "This shock tests how the organization responds when two apparently authoritative sources disagree."
  },
  owner: {
    name: "Secondary owner lost",
    controls: ["distribution", "transfer", "governance"],
    explanation: "This shock tests whether redundancy is real or only exists on paper."
  },
  ai: {
    name: "AI has incomplete context",
    controls: ["ai", "consistency", "traceability", "freshness"],
    explanation: "This shock tests whether AI-assisted knowledge use remains trustworthy when retrieval is incomplete."
  }
};

const questionList = document.getElementById("question-list");
const form = document.getElementById("assessment-form");
const results = document.getElementById("results");
const severity = document.getElementById("severity");
const severityValue = document.getElementById("severity-value");

function renderQuestions() {
  questionList.innerHTML = questions.map((question, index) => `
    <article class="question">
      <div>
        <h3>${String(index + 1).padStart(2, "0")} · ${question.title}</h3>
        <p>${question.help}</p>
      </div>
      <div class="rating" role="radiogroup" aria-label="${question.title}">
        ${[1,2,3,4,5].map(value => `
          <label title="${value} of 5">
            <input type="radio" name="${question.id}" value="${value}" ${value === 3 ? "checked" : ""}>
            <span>${value}</span>
          </label>
        `).join("")}
      </div>
    </article>
  `).join("");
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function scoreOf(responseMap, ids) {
  return Math.round(average(ids.map(id => responseMap[id] * 20)));
}

function collectResponses() {
  const responses = {};
  questions.forEach(question => {
    const selected = form.querySelector(`input[name="${question.id}"]:checked`);
    responses[question.id] = Number(selected ? selected.value : 3);
  });
  return responses;
}

function calculateProfile(responses) {
  const resilience = scoreOf(responses, ["distribution", "documentation", "transfer", "access"]);
  const assurance = scoreOf(responses, ["traceability", "freshness", "consistency", "governance"]);
  const memory = scoreOf(responses, ["documentation", "traceability", "transfer", "lessons"]);
  const evidence = scoreOf(responses, ["freshness", "consistency", "traceability", "ai"]);
  const decisionReproducibility = scoreOf(responses, ["documentation", "traceability", "transfer", "freshness"]);
  const aiKnowledgeReadiness = scoreOf(responses, ["ai", "freshness", "consistency", "governance"]);
  const fragility = 100 - scoreOf(responses, ["distribution", "documentation", "transfer", "access"]);
  const overall = Math.round(average([
    resilience,
    assurance,
    memory,
    evidence,
    decisionReproducibility,
    aiKnowledgeReadiness,
    100 - fragility
  ]));

  return {
    fragility,
    resilience,
    assurance,
    memory,
    evidence,
    decisionReproducibility,
    aiKnowledgeReadiness,
    overall
  };
}

function calculateShock(responses, profile, shockKey, severityLevel) {
  const shock = shocks[shockKey];
  const protection = scoreOf(responses, shock.controls);
  const severityFactor = 0.58 + (severityLevel * 0.09);
  const structuralFragility = profile.fragility * 0.3;
  const lossRadius = Math.round(clamp(((100 - protection) * severityFactor) + structuralFragility));
  return { ...shock, protection, lossRadius };
}

function bandForScore(score) {
  if (score >= 80) return "strong";
  if (score >= 65) return "developing";
  if (score >= 45) return "exposed";
  return "fragile";
}

function summaryFor(profile, shock) {
  const band = bandForScore(profile.overall);
  const labels = {
    strong: "The profile shows strong baseline resilience, with remaining exposure concentrated in specific dependencies.",
    developing: "The profile shows a workable knowledge base, but several weaknesses could become material under disruption.",
    exposed: "The profile shows material knowledge exposure. Important work may depend on context that is difficult to transfer, verify or recover.",
    fragile: "The profile shows high fragility. Knowledge loss or degraded evidence could materially affect continuity and decision quality."
  };
  const radiusText = shock.lossRadius >= 70
    ? "The selected shock produces a broad knowledge-loss radius."
    : shock.lossRadius >= 45
      ? "The selected shock produces a material but containable knowledge-loss radius."
      : "The selected shock is comparatively contained under the current self-reported controls.";
  return `${labels[band]} ${radiusText}`;
}

function getDrivers(responses) {
  return questions
    .map(question => ({ ...question, value: responses[question.id] }))
    .sort((a, b) => a.value - b.value)
    .slice(0, 4);
}

function scoreCards(profile) {
  return [
    ["Fragility risk", profile.fragility, true],
    ["Resilience", profile.resilience, false],
    ["Assurance", profile.assurance, false],
    ["Organizational memory", profile.memory, false],
    ["Evidence quality", profile.evidence, false],
    ["Decision reproducibility", profile.decisionReproducibility, false],
    ["AI knowledge readiness", profile.aiKnowledgeReadiness, false]
  ];
}

function renderResults(responses, profile, shock) {
  const organization = document.getElementById("organization").value.trim();
  const scope = document.getElementById("scope").value;
  document.getElementById("result-title").textContent = organization
    ? `${organization}: ${scope} profile`
    : `${scope} knowledge resilience profile`;
  document.getElementById("result-summary").textContent = summaryFor(profile, shock);

  const overallScore = document.getElementById("overall-score");
  overallScore.textContent = profile.overall;
  overallScore.parentElement.style.setProperty("--score-angle", `${profile.overall * 3.6}deg`);

  document.getElementById("score-grid").innerHTML = scoreCards(profile).map(([label, value, inverse]) => {
    const meterValue = inverse ? 100 - value : value;
    return `
      <article class="score-card">
        <small>${label}</small>
        <strong>${value}</strong>
        <div class="meter" aria-hidden="true"><i style="width:${meterValue}%"></i></div>
      </article>
    `;
  }).join("");

  document.getElementById("loss-radius").textContent = shock.lossRadius;
  document.getElementById("shock-explanation").textContent = `${shock.name}: ${shock.explanation} Current protection against this shock is ${shock.protection}/100 in the public demonstration model.`;

  const drivers = getDrivers(responses);
  document.getElementById("driver-list").innerHTML = drivers.map(driver => `<li><strong>${driver.value}/5:</strong> ${driver.title}</li>`).join("");
  document.getElementById("action-list").innerHTML = drivers.map(driver => `<li>${driver.action}</li>`).join("");

  results.hidden = false;
  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

severity.addEventListener("input", () => {
  severityValue.textContent = severity.value;
});

form.addEventListener("submit", event => {
  event.preventDefault();
  const responses = collectResponses();
  const profile = calculateProfile(responses);
  const shockKey = form.querySelector("input[name='shock']:checked").value;
  const shock = calculateShock(responses, profile, shockKey, Number(severity.value));
  renderResults(responses, profile, shock);
});

document.getElementById("print-result").addEventListener("click", () => window.print());

document.getElementById("reset-result").addEventListener("click", () => {
  results.hidden = true;
  form.reset();
  severity.value = 3;
  severityValue.textContent = "3";
  renderQuestions();
  document.getElementById("assessment").scrollIntoView({ behavior: "smooth", block: "start" });
});

renderQuestions();
