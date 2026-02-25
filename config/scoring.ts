export const scoringConfig = {
  categories: ["ownership", "judgment", "comms", "systems", "metrics", "people"] as const,
  defaults: 3,
  max: 5,
  min: 1,
  strongThreshold: 24,
  riskThreshold: 2,
  keywordRules: {
    metrics: ["kpi", "dashboard", "%", "conversion", "utilization", "ar aging", "collections", "nps", "show rate", "numbers"],
    systems: ["sop", "standardization", "raci", "root cause", "playbook", "prevention", "process", "workflow"],
    ownership: ["i owned", "i did", "accountable", "i led", "i decided"],
    comms: ["first", "second", "third", "priority", "bullet", "clear", "align"],
    redFlags: ["their fault", "idiot", "stupid", "blame", "whatever"]
  }
};

export type RubricCategory = (typeof scoringConfig.categories)[number];
