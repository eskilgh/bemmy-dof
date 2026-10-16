<script lang="ts">
  import { base } from '$app/paths';
  import { TEAM_LABEL, TEAM_HERO, type Team } from '$lib/config';
  import { teams, scores } from '$lib/stores';

  export let team: Team;

  $: label = TEAM_LABEL[team];
  $: hero = `${base}/img/${TEAM_HERO[team]}`;
  $: members = $teams[team];
  $: score = $scores[team];
</script>

<section class="col" class:bendik={team === 'bendik'} class:emmy={team === 'emmy'}>
  <h2>{label}</h2>
  <div class="photo-frame">
    <img src={hero} alt={label} />
  </div>
  {#key score}
    <div class="score pop">{score}</div>
  {/key}
  <ul class="members">
    {#each members as m (m.id)}
      <li>{m.name}</li>
    {:else}
      <li class="empty">(no members yet)</li>
    {/each}
  </ul>
</section>

<style>
  .col {
    flex: 1 1 0;
    min-width: 0;
    border: 5px solid var(--ink);
    border-radius: 14px;
    padding: 10px 10px 14px;
    background: #fff;
    box-shadow: 6px 6px 0 var(--ink);
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
    overflow: hidden;
  }
  .col::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(0, 0, 0, 0.07) 1px, transparent 1.5px);
    background-size: 8px 8px;
    pointer-events: none;
    opacity: 0.55;
  }
  .col.bendik {
    background: linear-gradient(180deg, #ffe4e0 0%, #fff 60%);
  }
  .col.emmy {
    background: linear-gradient(180deg, #e3f3d2 0%, #fff 60%);
  }
  h2 {
    font-size: clamp(1.4rem, 5vw, 2.2rem);
    color: var(--ink);
    text-shadow: 2px 2px 0 var(--corn);
    position: relative;
  }
  .bendik h2 {
    text-shadow: 2px 2px 0 var(--salsa);
  }
  .emmy h2 {
    text-shadow: 2px 2px 0 var(--lime);
  }
  .photo-frame {
    position: relative;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    border: 4px solid var(--ink);
    border-radius: 10px;
    box-shadow: 4px 4px 0 var(--ink);
    background: #fff;
    margin: 4px auto;
    width: 85%;
    max-width: 220px;
  }
  .photo-frame img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .score {
    font-family: 'Bangers', sans-serif;
    font-size: clamp(3.5rem, 18vw, 6rem);
    line-height: 1;
    color: var(--ink);
    text-shadow:
      3px 3px 0 var(--corn),
      -2px -2px 0 var(--corn);
    position: relative;
  }
  .bendik .score {
    text-shadow:
      3px 3px 0 var(--salsa),
      -2px -2px 0 var(--salsa);
  }
  .emmy .score {
    text-shadow:
      3px 3px 0 var(--lime),
      -2px -2px 0 var(--lime);
  }
  .members {
    list-style: none;
    padding: 0;
    margin: 4px 0 0;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    justify-content: center;
    position: relative;
  }
  .members li {
    background: var(--corn);
    border: 2px solid var(--ink);
    border-radius: 999px;
    padding: 2px 10px;
    font-size: 0.95rem;
    box-shadow: 2px 2px 0 var(--ink);
  }
  .bendik .members li {
    background: #ffb3aa;
  }
  .emmy .members li {
    background: #c9e8a9;
  }
  .members li.empty {
    background: transparent;
    border: 2px dashed var(--ink);
    box-shadow: none;
    opacity: 0.7;
  }
</style>
