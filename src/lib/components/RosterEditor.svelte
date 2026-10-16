<script lang="ts">
  import { teams } from '$lib/stores';
  import { backend } from '$lib/firebase';
  import { TEAMS, TEAM_LABEL, type Team } from '$lib/config';
  import type { Member } from '$lib/types';

  let newName = '';
  let newTeam: Team = 'bendik';
  let saving = false;

  async function addMember(e: Event) {
    e.preventDefault();
    if (!newName.trim()) return;
    saving = true;
    try {
      await backend.addMember(newTeam, newName.trim());
      newName = '';
    } finally {
      saving = false;
    }
  }

  async function remove(team: Team, m: Member) {
    if (!confirm(`Fjern ${m.name} fra ${TEAM_LABEL[team]}?`)) return;
    await backend.removeMember(team, m.id);
  }

  async function move(fromTeam: Team, m: Member) {
    const toTeam: Team = fromTeam === 'bendik' ? 'emmy' : 'bendik';
    await backend.moveMember(fromTeam, toTeam, m);
  }
</script>

<section class="comic-card">
  <h3>Deltakere</h3>

  <form class="add-row" on:submit={addMember}>
    <input type="text" bind:value={newName} placeholder="Navn" required />
    <select bind:value={newTeam}>
      {#each TEAMS as t}
        <option value={t}>{TEAM_LABEL[t]}</option>
      {/each}
    </select>
    <button class="btn btn--lime" type="submit" disabled={saving || !newName.trim()}>
      Legg til
    </button>
  </form>

  <div class="teams">
    {#each TEAMS as t}
      <div class="team" class:bendik={t === 'bendik'} class:emmy={t === 'emmy'}>
        <h4>{TEAM_LABEL[t]}</h4>
        <ul>
          {#each $teams[t] as m (m.id)}
            <li>
              <span class="name">{m.name}</span>
              <div class="row-btns">
                <button type="button" class="mini" on:click={() => move(t, m)} title="Bytt lag">
                  ⇄
                </button>
                <button
                  type="button"
                  class="mini danger"
                  on:click={() => remove(t, m)}
                  title="Fjern"
                >
                  ✕
                </button>
              </div>
            </li>
          {:else}
            <li class="empty">(tomt)</li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
</section>

<style>
  h3 {
    font-family: 'Bangers', sans-serif;
    font-size: 1.6rem;
    letter-spacing: 1.5px;
    text-shadow: 2px 2px 0 var(--lime);
    margin: 0 0 10px;
  }
  h4 {
    font-family: 'Bangers', sans-serif;
    letter-spacing: 1px;
    margin: 0 0 6px;
    font-size: 1.1rem;
  }
  .add-row {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 6px;
    margin-bottom: 14px;
  }
  @media (max-width: 420px) {
    .add-row {
      grid-template-columns: 1fr;
    }
  }
  .teams {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  @media (max-width: 420px) {
    .teams {
      grid-template-columns: 1fr;
    }
  }
  .team {
    border: 3px solid var(--ink);
    border-radius: 10px;
    padding: 8px;
    background: #fff;
    box-shadow: 3px 3px 0 var(--ink);
  }
  .team.bendik {
    background: #ffe4e0;
  }
  .team.emmy {
    background: #e3f3d2;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    background: #fff;
    border: 2px solid var(--ink);
    border-radius: 8px;
    padding: 4px 8px;
  }
  li.empty {
    background: transparent;
    border: 2px dashed var(--ink);
    opacity: 0.65;
    justify-content: center;
  }
  .row-btns {
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
  .mini:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 var(--ink);
  }
</style>
