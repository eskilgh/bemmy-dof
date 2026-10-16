<script lang="ts">
  import { isAdmin } from '$lib/stores';
  import { auth } from '$lib/firebase';

  let pw = '';
  let error = '';
  let submitting = false;

  async function submit(e: Event) {
    e.preventDefault();
    if (!pw) return;
    submitting = true;
    error = '';
    try {
      await auth.signIn(pw);
      pw = '';
    } catch {
      error = 'Feil passord 🌶️';
      setTimeout(() => (error = ''), 600);
    } finally {
      submitting = false;
    }
  }
</script>

{#if $isAdmin}
  <slot />
{:else}
  <form class="gate comic-card" class:shake={error} on:submit={submit}>
    <h2>¡Kun admin!</h2>
    <p>Skriv inn passordet for å legge til poeng.</p>
    <input
      type="password"
      bind:value={pw}
      placeholder="passord"
      autocomplete="current-password"
      autofocus
    />
    <button class="btn btn--salsa" type="submit" disabled={submitting || !pw}>
      {submitting ? '…' : 'Logg inn'}
    </button>
    {#if error}
      <p class="err">{error}</p>
    {/if}
  </form>
{/if}

<style>
  .gate {
    max-width: 360px;
    margin: 40px auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  h2 {
    font-size: 2rem;
    text-shadow: 2px 2px 0 var(--salsa);
  }
  .err {
    color: #a01818;
    font-weight: bold;
    margin: 0;
  }
</style>
