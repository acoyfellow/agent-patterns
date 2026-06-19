export type Pattern = {
  slug: string;
  number: string;
  name: string;
  promise: string;
  useWhen: string;
  mechanism: string[];
  code: string;
};

export const patterns: Pattern[] = [
  {
    slug: 'compile-the-fuzzy',
    number: '01',
    name: 'Compile the fuzzy',
    promise: 'Spend tokens once; make the repeated path deterministic.',
    useWhen: 'A model repeatedly applies the same standards, policy, or review rubric.',
    mechanism: [
      'Ask a model to extract explicit rules from examples.',
      'Encode stable rules as types, linters, AST queries, or tests.',
      'Leave only genuinely ambiguous cases for the model.',
    ],
    code: `const deterministic = await runChecks(change, rules);\nif (deterministic.complete) return deterministic;\nreturn reviewAmbiguity(change, deterministic.findings);`,
  },
  {
    slug: 'bounded-loop',
    number: '02',
    name: 'Bound every loop',
    promise: 'Make termination and maximum spend properties of the program.',
    useWhen: 'An agent retries, reflects, searches, or works through a task queue.',
    mechanism: [
      'Set iteration, token, and wall-clock budgets before execution.',
      'Check the budget before every model call.',
      'Return the best known result and a typed stop reason.',
    ],
    code: `for (let turn = 0; turn < budget.maxTurns; turn++) {\n  if (spent >= budget.maxTokens) return { state, stop: 'token-budget' };\n  state = await advance(state);\n  if (state.done) return { state, stop: 'complete' };\n}\nreturn { state, stop: 'turn-budget' };`,
  },
  {
    slug: 'durable-flat-workflow',
    number: '03',
    name: 'Durable, flat workflow',
    promise: 'Replace nested autonomous loops with named, retryable steps.',
    useWhen: 'Work must survive restarts and remain inspectable without one long model session.',
    mechanism: [
      'Decompose work into explicit steps.',
      'Checkpoint outputs at each boundary.',
      'Retry infrastructure, not the entire reasoning history.',
    ],
    code: `for (const task of event.payload.tasks) {\n  await step.do(\`process-\${task.id}\`, () =>\n    runSteeredAgent(task, guardrails),\n  );\n}`,
  },
  {
    slug: 'steering-envelope',
    number: '04',
    name: 'Steering envelope',
    promise: 'Constrain freedom without scripting the answer.',
    useWhen: 'A task needs model judgment but must obey cost, tool, and quality constraints.',
    mechanism: [
      'Pass allowed tools and an explicit objective.',
      'Require evidence and an output schema.',
      'Reject actions outside the capability envelope.',
    ],
    code: `const result = await agent.run(task, {\n  tools: capabilities.for(task),\n  maxTokens: 2_000,\n  output: ReviewSchema,\n  requireEvidence: true,\n});`,
  },
  {
    slug: 'harness-first',
    number: '05',
    name: 'Harness before autonomy',
    promise: 'Turn an open-ended goal into a measurable search problem.',
    useWhen: 'You can describe success more reliably than you can prescribe the implementation.',
    mechanism: [
      'Build real vertical tests around the boundary.',
      'Give the agent fast, machine-readable feedback.',
      'Stop on passing evidence, not self-reported confidence.',
    ],
    code: `while (budget.claim()) {\n  const candidate = await improve(current, receipt);\n  receipt = await realHarness.verify(candidate);\n  if (receipt.passed) return candidate;\n  current = candidate;\n}`,
  },
  {
    slug: 'human-checkpoint',
    number: '06',
    name: 'Human checkpoint',
    promise: 'Pause at irreversible or expensive boundaries.',
    useWhen: 'Execution can spend money, publish, delete, grant access, or affect people.',
    mechanism: [
      'Prepare a complete preview and evidence bundle.',
      'Suspend durably rather than polling a model.',
      'Resume only with scoped, expiring approval.',
    ],
    code: `const plan = await step.do('prepare', () => prepare(input));\nconst approval = await step.waitForEvent('approve', { timeout: '24 hours' });\nassertScope(approval, plan.effects);\nawait step.do('apply', () => apply(plan));`,
  },
];
