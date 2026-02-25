import { scoringConfig, RubricCategory } from "@/config/scoring";
import type { SubmissionInput } from "@/lib/validators";

const countHits = (text: string, words: string[]) => {
  const lower = text.toLowerCase();
  return words.some((word) => lower.includes(word));
};

export function scoreSubmission(input: SubmissionInput) {
  const merged = [
    ...input.answers.screening,
    input.answers.miniCase.next10,
    input.answers.miniCase.next2h,
    input.answers.miniCase.nextWeek,
    input.answers.miniCase.metrics,
    input.answers.writing.teamsMessage,
    input.answers.writing.patientEmail
  ].join("\n");

  const scores: Record<RubricCategory, number> = {
    ownership: scoringConfig.defaults,
    judgment: scoringConfig.defaults,
    comms: scoringConfig.defaults,
    systems: scoringConfig.defaults,
    metrics: scoringConfig.defaults,
    people: scoringConfig.defaults
  };

  if (countHits(merged, scoringConfig.keywordRules.metrics)) scores.metrics += 1;
  if (countHits(merged, scoringConfig.keywordRules.systems)) scores.systems += 1;
  if (countHits(merged, scoringConfig.keywordRules.ownership)) scores.ownership += 1;
  if (countHits(merged, scoringConfig.keywordRules.comms)) scores.comms += 1;

  if (countHits(merged, scoringConfig.keywordRules.redFlags)) {
    scores.judgment -= 1;
    scores.people -= 1;
  }

  (Object.keys(scores) as RubricCategory[]).forEach((key) => {
    scores[key] = Math.max(scoringConfig.min, Math.min(scoringConfig.max, scores[key]));
  });

  const totalScore = Object.values(scores).reduce((sum, n) => sum + n, 0);
  const flags = [] as string[];

  if (totalScore >= scoringConfig.strongThreshold) flags.push("strong-operator");
  if (Object.values(scores).some((value) => value <= scoringConfig.riskThreshold)) flags.push("risk-area");
  if (!countHits(merged, scoringConfig.keywordRules.metrics)) flags.push("vague-metrics");

  return { scores, totalScore, flags };
}
