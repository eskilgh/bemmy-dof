<script lang="ts">
  import { base } from '$app/paths';
  import { onMount } from 'svelte';

  // The 15 photos minus the 3 already used (hero + two team columns), so the
  // strip feels like "other glimpses" rather than repeats of what's on screen.
  let photos = [
    '468435959_10169664733310504_654137745890156824_n.jpg',
    '468555241_10169734825590504_1236203163763119461_n.jpg',
    '468596547_10161549507720376_1338764354268861956_n.jpg',
    '468668788_10169789310655504_2861190172934520016_n.jpg',
    '468736861_10169775080035504_6257278395015914260_n.jpg',
    '469165956_10169826936070504_8708156011395523008_n.jpg',
    '472336998_10170345119905504_4885915971126676922_n.jpg',
    '473596938_10170545326890504_5974434238877714690_n.jpg',
    '473682838_10170534217485504_8121575501988084118_n.jpg',
    '473724503_10170548755410504_6562342733319682186_n.jpg',
    '649156768_10173823850725504_4893320322182299542_n.jpg',
    '67831979_10162146875835504_22449489113513984_n.jpg'
  ];

  // Deterministic tilt per photo so hydration matches SSR output.
  const tilt = (i: number) => ((i * 37) % 11) - 5; // range: -5..5 degrees

  let lightboxSrc: string | null = null;

  function close() { lightboxSrc = null; }
  function onKeydown(e: KeyboardEvent) { if (e.key === 'Escape') close(); }

  // JS-driven scroll so drag can take over the same transform.
  let track: HTMLDivElement;
  let scrollX = 0;
  let halfWidth = 0;
  let raf: number;

  let isDragging = false;
  let isHovered = false;
  let dragMoved = false;
  let dragStartX = 0;
  let dragStartScrollX = 0;

  function wrap(x: number) {
    // Keep scrollX in (-halfWidth, 0]
    x = x % halfWidth;
    if (x > 0) x -= halfWidth;
    return x;
  }

  onMount(() => {
    // Shuffle in onMount to avoid SSR/client hydration mismatch.
    for (let i = photos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [photos[i], photos[j]] = [photos[j], photos[i]];
    }
    photos = photos; // trigger reactivity

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const SPEED = prefersReducedMotion ? 0 : 0.3;
    halfWidth = track.scrollWidth / 2;

    function animate() {
      if (!isDragging && !isHovered) {
        scrollX -= SPEED;
        scrollX = wrap(scrollX);
      }
      track.style.transform = `translateX(${scrollX}px)`;
      raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  });

  function startDrag(clientX: number) {
    isDragging = true;
    dragMoved = false;
    dragStartX = clientX;
    dragStartScrollX = scrollX;
  }

  function moveDrag(clientX: number) {
    if (!isDragging) return;
    const delta = clientX - dragStartX;
    if (Math.abs(delta) > 4) dragMoved = true;
    scrollX = wrap(dragStartScrollX + delta);
  }

  function endDrag() { isDragging = false; }

  function tryOpen(src: string) {
    if (!dragMoved) lightboxSrc = src;
  }
</script>

<svelte:window
  on:keydown={onKeydown}
  on:mousemove={(e) => moveDrag(e.clientX)}
  on:mouseup={endDrag}
/>

<section class="strip" aria-label="Photo strip">
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="viewport"
    class:dragging={isDragging}
    on:mouseenter={() => (isHovered = true)}
    on:mouseleave={() => { isHovered = false; endDrag(); }}
    on:mousedown|preventDefault={(e) => startDrag(e.clientX)}
    on:touchstart|passive={(e) => startDrag(e.touches[0].clientX)}
    on:touchmove|preventDefault={(e) => moveDrag(e.touches[0].clientX)}
    on:touchend={endDrag}
  >
    <div class="track" bind:this={track}>
      {#each [...photos, ...photos] as src, i}
        <figure
          class="polaroid"
          style="transform: rotate({tilt(i)}deg)"
          role="button"
          tabindex="0"
          aria-label="Enlarge photo"
          on:click={() => tryOpen(src)}
          on:keydown={(e) => e.key === 'Enter' && tryOpen(src)}
        >
          <span class="tape" />
          <img src="{base}/img/{src}" alt="" loading="lazy" />
        </figure>
      {/each}
    </div>
  </div>
</section>

{#if lightboxSrc}
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div class="lightbox" on:click={close} role="dialog" aria-modal="true" aria-label="Photo enlarged">
    <button class="close" on:click={close} aria-label="Close">&times;</button>
    <img src="{base}/img/{lightboxSrc}" alt="" on:click|stopPropagation />
  </div>
{/if}

<style>
  .strip {
    margin: 32px 0 8px;
    padding: 18px 0;
    border-top: 4px solid var(--ink);
    border-bottom: 4px solid var(--ink);
    background: #fff;
    background-image:
      radial-gradient(circle, rgba(0, 0, 0, 0.07) 1px, transparent 1.5px);
    background-size: 8px 8px;
    overflow: hidden;
  }
  .viewport {
    overflow: hidden;
    width: 100%;
    cursor: grab;
    user-select: none;
  }
  .viewport.dragging {
    cursor: grabbing;
  }
  .track {
    display: flex;
    gap: 22px;
    width: max-content;
    padding: 10px 22px;
  }

  .polaroid {
    position: relative;
    flex: 0 0 auto;
    width: 140px;
    background: #fff;
    padding: 8px 8px 28px;
    border: 3px solid var(--ink);
    border-radius: 2px;
    box-shadow: 4px 4px 0 var(--ink);
    margin: 0;
    cursor: pointer;
    transition: transform 0.3s ease;
  }
  .polaroid:hover {
    transform: rotate(0deg) scale(1.08) !important;
    z-index: 2;
  }
  .polaroid img {
    display: block;
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border: 2px solid var(--ink);
    pointer-events: none;
  }
  .tape {
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%) rotate(-3deg);
    width: 48px;
    height: 14px;
    background: rgba(255, 220, 100, 0.6);
    border: 1px solid rgba(0, 0, 0, 0.3);
  }

  .lightbox {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
  .lightbox img {
    max-width: min(90vw, 700px);
    max-height: 90vh;
    object-fit: contain;
    border: 4px solid #fff;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.7);
    pointer-events: auto;
  }
  .close {
    position: absolute;
    top: 16px;
    right: 20px;
    background: none;
    border: none;
    color: #fff;
    font-size: 2.5rem;
    line-height: 1;
    cursor: pointer;
    padding: 0 8px;
    opacity: 0.8;
  }
  .close:hover {
    opacity: 1;
  }
</style>
