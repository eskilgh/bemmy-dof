<script lang="ts">
  export let variant: 'bendik' | 'emmy' | 'neutral' = 'neutral';
</script>

<div class="bubble" class:bendik={variant === 'bendik'} class:emmy={variant === 'emmy'}>
  <slot />
  <span class="tail" />
</div>

<style>
  .bubble {
    position: relative;
    background: #fff;
    border: 3px solid var(--ink);
    border-radius: 18px;
    padding: 10px 14px;
    box-shadow: 3px 3px 0 var(--ink);
    display: inline-block;
    font-family: 'Patrick Hand', cursive;
  }
  .bubble.bendik {
    background: #ffd8d3;
  }
  .bubble.emmy {
    background: #e0f5cf;
  }
  .tail {
    position: absolute;
    bottom: -10px;
    left: 24px;
    width: 16px;
    height: 16px;
    background: inherit;
    border-right: 3px solid var(--ink);
    border-bottom: 3px solid var(--ink);
    transform: rotate(45deg);
  }
</style>
