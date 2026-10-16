<script lang="ts">
  import { onMount } from 'svelte';

  type Stop = {
    time: string;
    title: string;
    where?: string;
    note?: string;
    icon: string;
  };
  type Transit = { kind: 'transit'; text: string };
  type Item = Stop | Transit;

  const plan: Item[] = [
    {
      time: '07–08',
      title: 'Frokost',
      where: 'Hjem til Emmy og Bendik',
      icon: '☕',
    },
    {
      time: 'Ca. 10',
      title: 'Badstue for voksne',
      where: 'Fossekallen – Sukkerbiten (10:15–12:15)',
      note: 'Husk badetøy, håndkle og sittehåndkle!',
      icon: '🧖',
    },
    {
      time: 'Ca. 10',
      title: 'Lekeplass + kaffe & bolle',
      where: 'Oslobukta — for barnefamilier / ikke-badstue',
      icon: '🧒',
    },
    { kind: 'transit', text: 'Ca. 25 min — til fots eller buss →' },
    {
      time: '12',
      title: 'Barnevennlig aktivitet',
      where: 'Klosterengaparken — hinderløype eller ballspill',
      icon: '🤸',
    },
    { kind: 'transit', text: '37-bussen Galgeberg → Helsfyr (ca. 8 min) →' },
    {
      time: '13',
      title: 'Karaokegruble',
      where: 'Etterstadsletta 23A — «Tacobit for beat»',
      icon: '🎤',
    },
    { kind: 'transit', text: '21-bussen Helsfyr → Gladengveien (ca. 3 min) →' },
    {
      time: '14',
      title: 'Lunsj hos Runese',
      where: 'Linsesuppe, brød og smør',
      icon: '🥣',
    },
    { kind: 'transit', text: '21-bussen → Fougners vei (ca. 4 min) →' },
    {
      time: '15:30',
      title: 'Slåball',
      where: 'Ola Narr',
      icon: '⚾',
    },
    { kind: 'transit', text: 'Liten gåtur (ca. 20 min) →' },
    {
      time: '17:00',
      title: 'Quiz, leker & drinker',
      where: 'Hos Kaja — Steenstrups gate 5',
      icon: '🎲',
    },
    { kind: 'transit', text: 'Gå (1 min) →' },
    {
      time: '20:30',
      title: 'Middag & kåring av vinnerlag! 🏆',
      where: 'Theka — indisk street food',
      icon: '🍛',
    },
    {
      time: 'Senere',
      title: 'Eventuelt ut på byen 🍻💃',
      icon: '🪩',
    },
  ];

  const isTransit = (x: Item): x is Transit => (x as Transit).kind === 'transit';

  type Timed = Stop & { startMin: number | null; endMin: number | null };

  const parseOne = (s: string): number | null => {
    const m = s.match(/(\d{1,2})(?::(\d{2}))?/);
    return m ? Number(m[1]) * 60 + Number(m[2] ?? '0') : null;
  };
  const parseRange = (s: string): [number | null, number | null] => {
    const parts = s.split(/[-–]/).map((p) => p.trim());
    if (parts.length >= 2) return [parseOne(parts[0]), parseOne(parts[1])];
    return [parseOne(s), null];
  };

  const schedule: (Timed | Transit)[] = (() => {
    const stopIdx: number[] = [];
    plan.forEach((x, i) => {
      if (!isTransit(x)) stopIdx.push(i);
    });
    return plan.map((item, i): Timed | Transit => {
      if (isTransit(item)) return item;
      const [startMin, rawEnd] = parseRange(item.time);
      let endMin = rawEnd;
      if (endMin === null) {
        const nextI = stopIdx.find((n) => n > i);
        if (nextI !== undefined) endMin = parseRange((plan[nextI] as Stop).time)[0];
      }
      return { ...item, startMin, endMin };
    });
  })();

  let nowMin: number | null = null;

  function osloMinutes(): number {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Oslo',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(new Date());
    const h = Number(parts.find((p) => p.type === 'hour')?.value ?? '0');
    const m = Number(parts.find((p) => p.type === 'minute')?.value ?? '0');
    return h * 60 + m;
  }

  function isActive(now: number | null, start: number | null, end: number | null): boolean {
    if (now === null || start === null) return false;
    const e = end ?? start + 60;
    return now >= start && now < e;
  }

  onMount(() => {
    const tick = () => (nowMin = osloMinutes());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  });
</script>

<svelte:head>
  <title>Bemmy DOF · Dagsplan</title>
</svelte:head>

<section class="intro comic-card">
  <h2>Dagsplan</h2>
  <p>
    Aktivitetene er barnevennlige fram til kl. 14:00 — deretter starter voksenfesten. Kjøp
    <strong>dagsbillett på Ruter</strong>, ta med <strong>badetøy og håndkle</strong>, og klær du
    kan både tulle og spise middag i (det er tid til å skifte underveis).
  </p>
</section>

<ol class="timeline">
  {#each schedule as item}
    {#if isTransit(item)}
      <li class="transit">
        <span>🚶 {item.text}</span>
      </li>
    {:else}
      {@const active = isActive(nowMin, item.startMin, item.endMin)}
      <li class="stop" class:is-now={active}>
        <div class="time">{item.time}</div>
        <div class="card comic-card">
          <div class="head">
            <span class="icon" aria-hidden="true">{item.icon}</span>
            <h3>{item.title}</h3>
            {#if active}<span class="now-badge">NÅ</span>{/if}
          </div>
          {#if item.where}<p class="where">{item.where}</p>{/if}
          {#if item.note}<p class="note">{item.note}</p>{/if}
        </div>
      </li>
    {/if}
  {/each}
</ol>

<style>
  .intro {
    margin-bottom: 20px;
    background: var(--corn);
  }
  .intro h2 {
    font-size: 2rem;
    color: var(--ink);
    text-shadow: 2px 2px 0 var(--salsa);
    margin-bottom: 10px;
  }
  .intro p {
    margin: 0;
    line-height: 1.45;
  }

  .timeline {
    list-style: none;
    padding: 0;
    margin: 0;
    position: relative;
  }
  .timeline::before {
    content: '';
    position: absolute;
    left: 56px;
    top: 10px;
    bottom: 10px;
    width: 4px;
    background: repeating-linear-gradient(
      to bottom,
      var(--ink) 0 10px,
      transparent 10px 18px
    );
    z-index: 0;
  }

  .stop {
    position: relative;
    display: grid;
    grid-template-columns: 72px 1fr;
    gap: 10px;
    margin-bottom: 14px;
    z-index: 1;
  }
  .time {
    font-family: 'Bangers', sans-serif;
    letter-spacing: 1px;
    background: var(--salsa);
    color: #fff;
    border: var(--border);
    border-radius: 50%;
    box-shadow: var(--shadow-hard-sm);
    width: 68px;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 1rem;
    line-height: 1;
    padding: 4px;
    transform: rotate(-4deg);
    flex-shrink: 0;
  }

  .card {
    background: #fff;
    border-width: 3px;
    transition: background 0.3s ease;
  }
  .stop.is-now .card {
    background: var(--corn);
    box-shadow: var(--shadow-hard), 0 0 0 4px var(--salsa);
    animation: nowPulse 1.6s ease-in-out infinite;
  }
  .stop.is-now .time {
    background: var(--lime);
    color: var(--ink);
    transform: rotate(-4deg) scale(1.08);
  }
  @keyframes nowPulse {
    0%, 100% { box-shadow: var(--shadow-hard), 0 0 0 4px var(--salsa); }
    50% { box-shadow: var(--shadow-hard), 0 0 0 8px var(--salsa); }
  }
  .now-badge {
    margin-left: auto;
    font-family: 'Bangers', sans-serif;
    letter-spacing: 2px;
    background: var(--salsa);
    color: #fff;
    padding: 2px 10px;
    border: 2px solid var(--ink);
    border-radius: 6px;
    box-shadow: 2px 2px 0 var(--ink);
    font-size: 0.95rem;
    transform: rotate(6deg);
    flex-shrink: 0;
  }
  .head {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }
  .head h3 {
    font-size: 1.3rem;
    letter-spacing: 1.5px;
  }
  .icon {
    font-size: 1.6rem;
    line-height: 1;
  }
  .where {
    margin: 2px 0;
    font-size: 1rem;
  }
  .note {
    margin: 6px 0 0;
    padding: 6px 10px;
    background: var(--corn);
    border: 2px dashed var(--ink);
    border-radius: 8px;
    font-size: 0.95rem;
  }

  .transit {
    margin: 2px 0 12px 72px;
    font-size: 0.9rem;
    opacity: 0.75;
    font-style: italic;
    position: relative;
    z-index: 1;
  }
  .transit span {
    background: var(--paper);
    padding: 2px 8px;
  }

  @media (max-width: 420px) {
    .timeline::before {
      left: 44px;
    }
    .stop {
      grid-template-columns: 56px 1fr;
      gap: 8px;
    }
    .time {
      width: 52px;
      height: 52px;
      font-size: 0.85rem;
    }
    .transit {
      margin-left: 56px;
    }
  }
</style>
