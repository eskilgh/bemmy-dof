<script lang="ts">
  import '../app.css';
  import { base } from '$app/paths';
  import { page } from '$app/stores';
  import { HERO_IMAGE } from '$lib/config';
  import { usingMockBackend } from '$lib/firebase';
  import PhotoStrip from '$lib/components/PhotoStrip.svelte';

  $: path = $page.url.pathname.replace(/\/$/, '');
  $: onAdmin = path.endsWith('/admin');
  $: onPlan = path.endsWith('/plan');
</script>

<div class="papel-strip" />
<header>
  <div class="hero">
    <img src="{base}/img/{HERO_IMAGE}" alt="Bendik & Emmy" />
    <div class="title">
      <h1>Bemmy Bemmy Bemmy</h1>
      <p class="sub">DOF DOF DOF</p>
    </div>
  </div>
  <nav>
    {#if onAdmin || onPlan}
      <a class="btn btn--ghost" href="{base}/">← Tavla</a>
    {:else}
      <a class="btn btn--lime" href="{base}/plan">📅 Plan</a>
      <a class="btn btn--salsa" href="{base}/admin">⚙︎ Admin</a>
    {/if}
  </nav>
</header>
<div class="papel-strip" />

{#if usingMockBackend}
  <div class="mock-warn">
    ⚠️ Kjører i lokal testmodus — poeng synkroniseres ikke mellom enheter. Lim inn Firebase-config
    i <code>src/lib/config.ts</code> for å slå på synkronisering.
  </div>
{/if}

<main>
  <slot />
</main>

<PhotoStrip />

<footer>
  <p>Laget med 🌮 til Bendik & Emmy</p>
</footer>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    background: var(--cream);
    position: relative;
  }
  .hero {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }
  .hero img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border: 3px solid var(--ink);
    border-radius: 50%;
    box-shadow: 3px 3px 0 var(--ink);
    transform: rotate(-4deg);
  }
  .title {
    min-width: 0;
  }
  h1 {
    font-family: 'Bangers', sans-serif;
    letter-spacing: 2px;
    font-size: clamp(1.5rem, 7vw, 2.4rem);
    color: var(--ink);
    text-shadow: 2px 2px 0 var(--salsa);
    margin: 0;
  }
  .sub {
    margin: 0;
    font-size: 0.95rem;
    opacity: 0.75;
  }
  nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 6px;
    flex-shrink: 0;
  }
  nav .btn {
    font-size: 0.9rem;
    padding: 8px 12px;
    white-space: nowrap;
  }
  .mock-warn {
    background: #fff6c2;
    color: #5a4300;
    border-bottom: 3px solid var(--ink);
    padding: 8px 14px;
    text-align: center;
    font-size: 0.9rem;
  }
  .mock-warn code {
    background: rgba(0, 0, 0, 0.08);
    padding: 1px 5px;
    border-radius: 4px;
  }
  main {
    padding: 14px;
    max-width: 820px;
    margin: 0 auto;
  }
  footer {
    text-align: center;
    padding: 24px 14px 40px;
    opacity: 0.75;
    font-size: 0.95rem;
  }
</style>
