<script lang="ts">
  import { backend } from '$lib/firebase';
  import { TEAMS, TEAM_LABEL, type Team } from '$lib/config';

  let team: Team = 'bendik';
  let game = '';
  let points = 10;
  let saving = false;
  let flash = '';

  async function submit(e: Event) {
    e.preventDefault();
    if (!game.trim()) return;
    saving = true;
    try {
      await backend.addLogEntry(team, game.trim(), Number(points) || 0);
      flash = `¡Added ${points} for ${TEAM_LABEL[team]}!`;
      game = '';
      points = 10;
      setTimeout(() => (flash = ''), 1800);
    } finally {
      saving = false;
    }
  }
</script>

<form class="comic-card add" on:submit={submit}>
  <h3>Add points</h3>

  <div class="chips">
    {#each TEAMS as t}
      <button
        type="button"
        class="chip"
        class:active={team === t}
        class:bendik={t === 'bendik'}
        class:emmy={t === 'emmy'}
        on:click={() => (team = t)}
      >
        {TEAM_LABEL[t]}
      </button>
    {/each}
  </div>

  <label>
    Game name
    <input type="text" bind:value={game} placeholder="e.g. Taco Toss" required />
  </label>

  <label>
    Points <span class="hint">(negative to subtract)</span>
    <input type="number" bind:value={points} step="1" required />
  </label>

  <button class="btn btn--salsa" type="submit" disabled={saving || !game.trim()}>
    {saving ? '…' : '¡Score!'}
  </button>

  {#if flash}
    <p class="flash">{flash}</p>
  {/if}
</form>

<style>
  .add {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  h3 {
    font-family: 'Bangers', sans-serif;
    font-size: 1.6rem;
    letter-spacing: 1.5px;
    text-shadow: 2px 2px 0 var(--corn);
    margin: 0;
  }
  .chips {
    display: flex;
    gap: 8px;
  }
  .chip {
    flex: 1;
    background: #fff;
    border: 3px solid var(--ink);
    border-radius: 10px;
    padding: 10px;
    font-family: 'Bangers', sans-serif;
    letter-spacing: 1px;
    font-size: 1rem;
    box-shadow: 3px 3px 0 var(--ink);
    cursor: pointer;
    transition: transform 0.08s;
  }
  .chip.active.bendik {
    background: var(--salsa);
    color: #fff;
  }
  .chip.active.emmy {
    background: var(--lime);
  }
  .chip:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 var(--ink);
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 1rem;
  }
  .hint {
    opacity: 0.65;
    font-size: 0.85rem;
  }
  .flash {
    margin: 0;
    text-align: center;
    color: var(--team-emmy-ink);
    font-weight: bold;
  }
</style>
