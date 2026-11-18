// A made-up class project, walked through the seven project-planning steps that the curriculum
// lists (outcome nS2HJVcYAkWB2AKADN4EKg K1.4), in the curriculum's order.

export interface PlanStep {
  name: string;
  icon: string;
  did: string;
}

export const PROJECT = {
  title: 'A bike rack for Willow Creek School',
  steps: [
    { name: 'Identify the issue and purpose', icon: '🎯', did: 'Bikes are locked to the fence and get scratched. Purpose: a safe place to park, so more students bike to school.' },
    { name: 'Conduct research', icon: '🔎', did: 'The class counts bikes for a week: 18 on the busiest day. The principal says a rack is allowed if the class pays for it.' },
    { name: 'Set goals', icon: '🏁', did: 'Put in one rack that holds 20 bikes, by the end of May.' },
    { name: 'Consider costs and resources', icon: '💰', did: 'A rack costs $600. A bake sale can raise about $300, and the parent council offers $300. The caretaker will bolt it down for free.' },
    { name: 'Decide the steps', icon: '🗒️', did: '1. Present the plan to the school council. 2. Hold the bake sale. 3. Order the rack. 4. Make a poster about bike safety.' },
    { name: 'Complete the plan', icon: '🔧', did: 'The bake sale raises $310. The rack goes in on May 28.' },
    { name: 'Reflect on the outcome', icon: '🪞', did: 'By June, the rack is full by 8:30 every morning. Next time: ask for two racks, and count again in the fall.' },
  ] as PlanStep[],
};
