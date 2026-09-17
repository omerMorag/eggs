import type { WizardAnswers } from "@/lib/validation/costEstimateSchemas";

export interface StepProps {
  answers: WizardAnswers;
  updateAnswer: <K extends keyof WizardAnswers>(key: K, value: WizardAnswers[K]) => void;
}
