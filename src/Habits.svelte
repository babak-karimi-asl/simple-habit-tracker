<script>
  import Habit from "./Habit.svelte";
  import {getDate,readValue,writeValue} from './utils'


  let newHabit = {};
  let state = "add";
  let offsetDay = 0;
  let currentDate = getDate(null,offsetDay)

  let habits = []
  const HABITS_STATS_KEY = 'habits-stats-'
  const HABITS_LIST_KEY = 'habits-list'


  function changeDay(value){
    offsetDay+=value
    currentDate = getDate(null,offsetDay)
    habits = readHabits()
  }

  function goToToday(){
    offsetDay = 0
    currentDate = getDate(null,offsetDay)
    habits = readHabits()
  }


  function resetHabit() {
    newHabit = { name: "", timeInMinutes: "", index: -1, step: "" };
  }

  function writeHabitsList(hbtlst){
    let resettedHabits = hbtlst.map(h=>({
      name: h.name,
      timeInMinutes: h.timeInMinutes,
      timeSpendInMinutes: 0,
      step: h.step,
    }))
    writeValue(HABITS_LIST_KEY,resettedHabits)
  }
  
  function writeHabits(hbts){
    writeValue(HABITS_STATS_KEY+currentDate,hbts)
  }
  function readHabits(){
    let result = readValue(HABITS_STATS_KEY+currentDate,[])
    if(!result || result.length<=0){
      result = readValue(HABITS_LIST_KEY,[])
      if(!result) result = []
    }
    return result
  }

  resetHabit();
  habits = readHabits();


  function handleMessage(event) {
    const index = event.detail.index;
    const command = event.detail.command.name;
    const value = event.detail.command.value;
    switch (command) {
      case "modifySpendTime":
        habits[index].timeSpendInMinutes += value;
        writeHabits(habits)
        break;
      case "edit":
        state = "edit";
        newHabit.name = habits[index].name;
        newHabit.timeInMinutes = habits[index].timeInMinutes;
        newHabit.step = habits[index].step;
        newHabit.index = index;
        break;
    }
  }

  function addNewHabit() {
    if (habits.filter((h) => h.name === newHabit.name).length) {
      alert("habit exists");
      return 0;
    }

    if (!newHabit.name || newHabit.name.length <= 0) {
      alert("please enter a name");
      return 0;
    }

    if (newHabit.timeInMinutes < 1) newHabit.timeInMinutes = 1;
    if (newHabit.step < 1) newHabit.step = 1;
    habits = [
      ...habits,
      {
        name: newHabit.name,
        timeInMinutes: newHabit.timeInMinutes,
        timeSpendInMinutes: 0,
        step: newHabit.step,
      },
    ];
    writeHabits(habits);
    writeHabitsList(habits)
    resetHabit();
  }

  function cancelUpdate() {
    state = "add";
    resetHabit();
  }

  function updateItem() {
    habits[newHabit.index].name = newHabit.name;
    habits[newHabit.index].timeInMinutes = newHabit.timeInMinutes;
    habits[newHabit.index].step = newHabit.step;
    writeHabits(habits);
    writeHabitsList(habits)
    cancelUpdate();
  }

  function deleteHabit(){
    if(confirm('delete habit?')){  
      let name = habits[newHabit.index].name
      habits = habits.filter(h=>h.name!==name)
      writeHabits(habits);
      writeHabitsList(habits)
      cancelUpdate()
    }
  }
</script>

<section class="habits">

  <div class="date">
    {#if state!=='edit'}
    <button on:click={()=>changeDay(-1)}> - </button>
    {/if}
    <span on:click={()=>state!=='edit'?goToToday():[]}>{currentDate}</span>
    {#if state!=='edit'}
    <button on:click={()=>changeDay(+1)}> + </button>
    {/if}
  </div>

  <h1>Habits</h1>

  {#if state==='edit'}
    <button class="delete-button" on:click={deleteHabit}>DELETE</button>
  {/if}

  <div class="new-form">
    <input type="text" placeholder="name" bind:value={newHabit.name} />
    <input type="number" placeholder="step" bind:value={newHabit.step} />
    <input
      type="number"
      placeholder="minute"
      bind:value={newHabit.timeInMinutes} />

    {#if state === 'add'}
      <button class="add-button" on:click={addNewHabit}>+</button>
    {/if}

    {#if state === 'edit'}
      <button class="cancel-button" on:click={cancelUpdate}>x</button>
      <button class="confirm-button" on:click={updateItem}>v</button>
    {/if}
  </div>



  <div class="list">
    {#each habits as h, i}
      <Habit {...h} index={i} on:message={handleMessage} />
    {/each}
  </div>
</section>
