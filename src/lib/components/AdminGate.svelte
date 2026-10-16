<script lang="ts">
  import { isAdmin } from '$lib/stores';
  import { ADMIN_PASSWORD } from '$lib/config';

  let pw = '';
  let error = false;

  function submit(e: Event) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      isAdmin.set(true);
      pw = '';
    } else {
      error = true;
      setTimeout(() => (error = false), 500);
    }
  }
</script>

{#if $isAdmin}
  <slot />
{:else}
  <form class="gate comic-card" class:shake={error} on:submit={submit}>
    <h2>¡Kun admin!</h2>
    <p>Skriv inn det magiske ordet for å legge til poeng.</p>
    <input
      type="password"
      bind:value={pw}
      placeholder="passord"
      autocomplete="off"
      autofocus
    />
    <button class="btn btn--salsa" type="submit">Logg inn</button>
    {#if error}
      <p class="err">Feil passord 🌶️</p>
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
