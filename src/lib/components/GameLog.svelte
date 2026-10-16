<script lang="ts">
  import { log } from '$lib/stores';
  import { TEAM_LABEL } from '$lib/config';
  import ComicBubble from './ComicBubble.svelte';

  function fmtTime(ts: number) {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
</script>

<section class="log">
  <h2>¡Spill-logg!</h2>
  {#if $log.length === 0}
    <p class="empty">Ingen spill spilt ennå. ¡Vamos!</p>
  {:else}
    <ul>
      {#each $log as entry (entry.id)}
        <li>
          <ComicBubble variant={entry.team}>
            <strong>{entry.game}</strong>
            <span class="pts" class:neg={entry.points < 0}>
              {entry.points >= 0 ? '+' : ''}{entry.points}
            </span>
            <span class="meta">
              {TEAM_LABEL[entry.team]} · {fmtTime(entry.timestamp)}
            </span>
          </ComicBubble>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
  .log {
    margin-top: 20px;
  }
  h2 {
    font-size: 1.8rem;
    text-shadow: 2px 2px 0 var(--corn);
    margin-bottom: 10px;
    text-align: center;
  }
  .empty {
    text-align: center;
    opacity: 0.7;
    font-style: italic;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  li :global(.bubble) {
    display: block;
    width: 100%;
  }
  .pts {
    font-family: 'Bangers', sans-serif;
    font-size: 1.4rem;
    margin-left: 10px;
    color: var(--team-emmy-ink);
  }
  .pts.neg {
    color: #a01818;
  }
  .meta {
    display: block;
    font-size: 0.85rem;
    opacity: 0.75;
    margin-top: 2px;
  }
</style>
