<script lang="ts">
  import { log } from '$lib/stores';
  import { backend } from '$lib/firebase';
  import { TEAM_LABEL, type Team } from '$lib/config';
  import type { LogEntry } from '$lib/types';

  let editingId: string | null = null;
  let editGame = '';
  let editPoints = 0;

  function startEdit(e: LogEntry) {
    editingId = e.id;
    editGame = e.game;
    editPoints = e.points;
  }

  async function saveEdit() {
    if (!editingId) return;
    await backend.updateLogEntry(editingId, {
      game: editGame.trim() || '(no name)',
      points: Number(editPoints) || 0
    });
    editingId = null;
  }

  async function del(id: string) {
    if (!confirm('Delete this entry?')) return;
    await backend.deleteLogEntry(id);
  }

  async function undoLast() {
    const latest = $log[0];
    if (!latest) return;
    if (!confirm(`Undo "${latest.game}" (${latest.points > 0 ? '+' : ''}${latest.points})?`)) return;
    await backend.deleteLogEntry(latest.id);
  }

  function fmt(ts: number) {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
</script>

<section class="comic-card">
  <div class="head">
    <h3>Edit game log</h3>
    <button class="btn btn--ghost" type="button" on:click={undoLast} disabled={$log.length === 0}>
      ↶ Undo last
    </button>
  </div>

  {#if $log.length === 0}
    <p class="empty">No entries yet.</p>
  {:else}
    <ul>
      {#each $log as e (e.id)}
        <li class:bendik={e.team === 'bendik'} class:emmy={e.team === 'emmy'}>
          {#if editingId === e.id}
            <div class="edit">
              <input type="text" bind:value={editGame} />
              <input type="number" bind:value={editPoints} step="1" />
              <button class="mini save" type="button" on:click={saveEdit}>Save</button>
              <button class="mini" type="button" on:click={() => (editingId = null)}>×</button>
            </div>
          {:else}
            <div class="row">
              <div>
                <strong>{e.game}</strong>
                <span class="pts" class:neg={e.points < 0}>
                  {e.points >= 0 ? '+' : ''}{e.points}
                </span>
                <div class="meta">
                  {TEAM_LABEL[e.team as Team]} · {fmt(e.timestamp)}
                </div>
              </div>
              <div class="btns">
                <button class="mini" type="button" on:click={() => startEdit(e)}>✎</button>
                <button class="mini danger" type="button" on:click={() => del(e.id)}>✕</button>
              </div>
            </div>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }
  h3 {
    font-family: 'Bangers', sans-serif;
    font-size: 1.6rem;
    letter-spacing: 1.5px;
    text-shadow: 2px 2px 0 var(--corn);
    margin: 0;
  }
  .empty {
    text-align: center;
    opacity: 0.7;
    font-style: italic;
    margin: 0;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-height: 50vh;
    overflow-y: auto;
  }
  li {
    border: 2px solid var(--ink);
    border-radius: 8px;
    padding: 6px 8px;
    background: #fff;
  }
  li.bendik {
    background: #ffe4e0;
  }
  li.emmy {
    background: #e3f3d2;
  }
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }
  .pts {
    font-family: 'Bangers', sans-serif;
    font-size: 1.1rem;
    margin-left: 8px;
    color: var(--team-emmy-ink);
  }
  .pts.neg {
    color: #a01818;
  }
  .meta {
    font-size: 0.8rem;
    opacity: 0.7;
  }
  .btns {
    display: flex;
    gap: 4px;
  }
  .mini {
    background: var(--corn);
    border: 2px solid var(--ink);
    border-radius: 6px;
    padding: 2px 8px;
    font-size: 0.9rem;
    cursor: pointer;
    box-shadow: 2px 2px 0 var(--ink);
  }
  .mini.danger {
    background: #c23030;
    color: #fff;
  }
  .mini.save {
    background: var(--lime);
  }
  .edit {
    display: grid;
    grid-template-columns: 1fr 90px auto auto;
    gap: 4px;
    align-items: center;
  }
  @media (max-width: 420px) {
    .edit {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
