<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let name, timeSpendInMinutes, timeInMinutes,step, index;
  $: percent = timeSpendInMinutes / timeInMinutes;

  function updateSpendTime(value) {
    dispatch("message", {
      index,
      command: { name: "modifySpendTime", value },
    });
  }

  function editIt(){
   dispatch("message", {
      index,
      command: { name: "edit" },
    });
  }
</script>

<div class="item">
  <div class="upper">
    <div class="name" on:click={editIt}>{name}</div>
    <div class="step">{step}</div>
    <div class="delimiter">{timeSpendInMinutes}/{timeInMinutes}</div>
    <div class="buttons">
      <button class="dec-button" on:click={() => updateSpendTime(-1*step)}>-</button>
      <button class="inc-button" on:click={() => updateSpendTime(step)}>+</button>
    </div>
  </div>
  <progress class="prg" value={percent * 100} max="100">
    {percent * 100}%
  </progress>
</div>
