<template>
  <div class="calendar">
    <p class="team-header">Current Sprint: <em>{{teamName[0].toUpperCase() + teamName.substring(1)}}</em></p>
    <div>
     <b-form-group label="">
      <b-button class="sprintDayButtons" variant="outline-dark" track-by="$index"  v-for="day in this.sprintLength" :key="day" @click="loadSprintDaily(day)">Stand Up {{day}}
      </b-button>
     </b-form-group>
    </div>
    <div class="sprintGoal">
      Goal for this Sprint: {{sprint_goal}}
    </div>
  </div>
</template>

<script>
  import SprintStore from "../stores/SprintStore"
  import Sprint from './Sprint'
  import StandUpsStore from "../stores/StandUpsStore"

  export default {
    name: 'CalendarView',

    // this is receiving the prop of sprintLEngth from the sprint vue
    data: () => {
      return {
        reactive: true,
        teamName: 'test',
        sprintInfo: '',
        selected: 'radio1',
        curentDaily: 0,
        sprint_goal: 'Please define me',
        sprintLength: 5,


      }
    },

  async mounted(){
      this.sprintInfo = SprintStore.data.sprintInfo
      this.teamName = SprintStore.data.teamName
      this.sprint_goal = this.sprintInfo[1].sprint_goal
      this.sprintLength = this.sprintInfo[1].sprint_length
      console.log("this.sprintInfo: ", this.sprintInfo)
      console.log("this.teamName: ", this.teamName)
    },

    methods: {
      loadSprintDaily(day) {
          console.log("loadSprintDaily:", this.sprintInfo[0], day)
     
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  border: 5px double #28284e;
  border-radius: 5px;
  padding: 10px;
  margin: 5%;
}
.team-header{
  font-size: 40px;
 
}
.sprintDayButtons {
  border-radius: 4px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 10px;
}
.sprintDayButtons:hover {
  opacity: 0.7;
  background-color: #1b354b;
  transition: opacity .55s ease-in-out;
}
.sprintGoal {
  padding: 20px;
  font-weight: bold;
  font-size: 25px;
}

</style>
