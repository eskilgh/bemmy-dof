<script lang="ts">
  import { backend } from '$lib/firebase';
  import { isAdmin } from '$lib/stores';

  async function resetAll() {
    if (!confirm('Reset ALL scores? This clears the game log for everyone. Rosters stay.')) return;
    if (!confirm('Really sure? There is no undo.')) return;
    await backend.resetAll();
  }

  function logout() {
    isAdmin.set(false);
  }
</script>

<section class="comic-card danger">
  <h3>Danger zone 🌶️</h3>
  <div class="row">
    <button class="btn btn--danger" type="button" on:click={resetAll}>Reset all scores</button>
    <button class="btn btn--ghost" type="button" on:click={logout}>Log out of admin</button>
  </div>
</section>

<style>
  .danger {
    border-color: #a01818;
    box-shadow: 6px 6px 0 #a01818;
  }
  h3 {
    font-family: 'Bangers', sans-serif;
    font-size: 1.6rem;
    letter-spacing: 1.5px;
    margin: 0 0 10px;
    color: #a01818;
  }
  .row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
</style>
