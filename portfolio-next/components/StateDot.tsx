import type { SkillState } from "@/data/types";

export default function StateDot({ state }: { state: SkillState }) {
  return <span className={`dot ${state}`} aria-hidden="true" />;
}
