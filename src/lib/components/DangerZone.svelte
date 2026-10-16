<script lang="ts">
  import { backend, auth } from '$lib/firebase';

  async function resetAll() {
    if (!confirm('Nullstille ALLE poeng? Dette tømmer spill-loggen for alle. Lagene beholdes.')) return;
    if (!confirm('Helt sikker? Dette kan ikke angres.')) return;
    await backend.resetAll();
  }

  async function logout() {
    await auth.signOut();
  }
</script>

<section class="comic-card danger">
  <h3>Faresone 🌶️</h3>
  <div class="row">
    <button class="btn btn--danger" type="button" on:click={resetAll}>Nullstill alle poeng</button>
    <button class="btn btn--ghost" type="button" on:click={logout}>Logg ut av admin</button>
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
