<script lang="ts">
  import { base } from '$app/paths';

  // The 15 photos minus the 3 already used (hero + two team columns), so the
  // strip feels like "other glimpses" rather than repeats of what's on screen.
  const photos = [
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
</script>

<section class="strip" aria-label="Photo strip">
  <div class="viewport">
    <div class="track">
      {#each [...photos, ...photos] as src, i}
        <figure class="polaroid" style="transform: rotate({tilt(i)}deg)">
          <span class="tape" />
          <img src="{base}/img/{src}" alt="" loading="lazy" />
        </figure>
      {/each}
    </div>
  </div>
</section>

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
  }
  .track {
    display: flex;
    gap: 22px;
    width: max-content;
    padding: 10px 22px;
    animation: scroll 90s linear infinite;
  }
  .viewport:hover .track,
  .viewport:focus-within .track {
    animation-play-state: paused;
  }
  @media (prefers-reduced-motion: reduce) {
    .track {
      animation: none;
    }
    .viewport {
      overflow-x: auto;
    }
  }

  @keyframes scroll {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
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
</style>
