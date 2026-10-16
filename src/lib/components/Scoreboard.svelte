<script lang="ts">
  import TeamColumn from './TeamColumn.svelte';
</script>

<div class="board">
  <TeamColumn team="bendik" />
  <TeamColumn team="emmy" />
</div>

<style>
  .board {
    display: flex;
    gap: 10px;
    align-items: stretch;
  }
  @media (max-width: 360px) {
    .board {
      gap: 6px;
    }
  }
</style>
