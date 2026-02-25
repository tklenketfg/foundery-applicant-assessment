export const siteConfig = {
  orgName: "The Foundery Group",
  roleTitle: "Practice Manager (Operator) Candidate Assessment",
  brands: ["Pinnacle Plastic Surgery", "Pinnacle Dermatology", "PURE Medical Spa"],
  adminRecipients: [process.env.ADMIN_NOTIFY_EMAIL || "ops@example.com"],
  payBandText: "Compensation aligned to experience and market benchmarks.",
  disclaimers: {
    noPhi: "Do not submit patient identifiers, medical records, or any PHI.",
    confidentiality: "Your submission is confidential and used for hiring decisions only."
  }
};
