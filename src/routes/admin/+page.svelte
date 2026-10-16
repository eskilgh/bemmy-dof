<script lang="ts">
  import AdminGate from '$lib/components/AdminGate.svelte';
  import AddPointsForm from '$lib/components/AddPointsForm.svelte';
  import RosterEditor from '$lib/components/RosterEditor.svelte';
  import LogEditor from '$lib/components/LogEditor.svelte';
  import DangerZone from '$lib/components/DangerZone.svelte';
</script>

<AdminGate>
  <div class="admin">
    <AddPointsForm />
    <RosterEditor />
    <LogEditor />
    <DangerZone />
  </div>
</AdminGate>

<style>
  .admin {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
