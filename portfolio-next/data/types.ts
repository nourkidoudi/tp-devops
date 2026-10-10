export type SkillState = "done" | "part" | "wip";

export const STATE_LABEL: Record<SkillState, string> = {
  done: "Pratiqué",
  part: "Bases",
  wip: "En apprentissage",
};

export type Stage = {
  slug: string;
  name: string;
  state: SkillState;
  tools: string[];
  text: string;
};

export type Tool = {
  name: string;
  mono: string;
  role: string;
  used: boolean;
  state: SkillState;
  label: string;
  text: string;
};

export type ProjectCategory = "DevSecOps" | "Web" | "Monitoring";

export type Project = {
  slug: string;
  category: ProjectCategory;
  title: string;
  status: string;
  summary: string;
  description: string[];
  highlights: string[];
  tags: string[];
  link?: string;
};

export type Experience = {
  when: string;
  role: string;
  where: string;
  text: string;
};
