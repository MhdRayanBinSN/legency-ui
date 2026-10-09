// "How we work" steps. Three identical sys-card articles copy-pasted apart from
// this data; team.tsx now maps over it.

import type { TeamIconName } from "@/components/home/icons";

export type WorkPlanStep = {
  icon: TeamIconName;
  title: string;
  body: string;
};

export const WORK_PLAN_STEPS: WorkPlanStep[] = [
  {
    icon: "plan",
    title: "Agreed priorities and delivery dates",
    body: "We agree the priorities with your team and schedule work around your plans. Requests stay in a shared channel, with larger changes scoped before work starts.",
  },
  {
    icon: "supplier",
    title: "Support for your supplier approval process",
    body: "We work with your legal and finance teams on contracts, security questions and purchase-order billing. Our experience includes enterprise security reviews and corporate accounts payable.",
  },
  {
    icon: "reporting",
    title: "Monthly reporting on results",
    body: "Your report shows completed work, the results we can measure and the priorities we recommend next. Depending on the agreed scope, it covers search visibility, AI citations and conversions.",
  },
];
