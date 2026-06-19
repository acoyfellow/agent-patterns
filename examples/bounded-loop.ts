export type Budget = { maxTurns: number; maxTokens: number };
export type State = { done: boolean; tokens: number; value: string };

export async function boundedLoop(
  initial: State,
  budget: Budget,
  advance: (state: State) => Promise<State>,
): Promise<{ state: State; stop: 'complete' | 'turn-budget' | 'token-budget' }> {
  let state = initial;
  for (let turn = 0; turn < budget.maxTurns; turn++) {
    if (state.tokens >= budget.maxTokens) return { state, stop: 'token-budget' };
    state = await advance(state);
    if (state.done) return { state, stop: 'complete' };
  }
  return { state, stop: 'turn-budget' };
}
