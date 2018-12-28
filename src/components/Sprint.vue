<template>
  <div class="body">
    <!-- loading spinner for transition -->
    <Spinner v-show="notLoading" id="pacman" name="ball-scale-multiple" color="#292b2c"/>

    <!-- below here is rendered after loading spinner timeout -->
    <div v-show="!notLoading" class="sprint">
      <!-- <b-btn class="postASprintBtn" v-b-modal.postSprintModal>Create A Sprint</b-btn> -->

     <!-- calendar view component rendered here-->
     <CalendarView class="cal" :sprintLength="sprintLength"/>

     <div class="sprintNotes">Sprint Notes:
        <b-form-textarea v-model="sprint_notes" type="text" value="sprint_notes" :rows="3"></b-form-textarea>
        <b-button id="sprintCardUpBtn" variant="outline-dark">✎ Notes</b-button>
     </div >

      <div class="sprintCardDiv" v-for="standup in standupsDay1[0]">
         <b-card class="sprintDailyCard" no-body
             style="max-width: 33%;"
            img-src="http://www.clker.com/cliparts/l/w/w/n/7/c/purple-square-button-md.png"
            img-alt="Image"
            img-top>
        <h4 slot="header">{{standup.username}}</h4>
        <b-list-group flush>
            <b-list-group-item> <br>
            Yesterday:
            <p v-if="standup.yesterday">{{standup.yesterday}}</p>
            <b-form-textarea v-else
              v-model="member1YesterdayText"
              class="memberInputField"
              type="textarea"
            ></b-form-textarea></b-list-group-item>
            <b-list-group-item> <br>Today:
            <p v-if="standup.today">{{standup.today}}</p>
            <b-form-textarea v-else
              v-model="member1TodayText"
              class="memberInputField"
              type="textarea">
              </b-form-textarea>
              </b-list-group-item>
            <b-list-group-item> <br>Helps:
            <p v-if="standup.helps">{{standup.helps}}</p>
            <b-form-textarea v-else
              v-model="member1HelpsText"
              class="memberInputField"
              type="textarea">
            </b-form-textarea>
            </b-list-group-item>
            <b-list-group-item>
              <b-button>Submit Stand Up</b-button>
              <b-button v-b-tooltip.hover title="Edit" id="edit" variant="outline-dark" class="teamEditDel" @click="showModal(standup.id)">✎</b-button>
            </b-list-group-item>
           </b-list-group>
         </b-card>
      <!-- End card loop -->
      </div>

    <!-- YOUR CARD form displays only when you havent submitted standup yet -->
    <!-- IM not proud of this. Last minuite Fluff for video -->
      <div class="yourCard">
        <b-card class="sprintDailyCard" no-body
            style="max-width: 33%;"
           img-src="http://www.clker.com/cliparts/l/w/w/n/7/c/purple-square-button-md.png"
           img-alt="Image"
           img-top>
       <h4 slot="header">(You)</h4>
       <b-list-group flush>
           <b-list-group-item> <br>
           Yesterday:
           <p v-if="yourStandUpSubmitted">{{yourStandUpYesterday}}</p>
           <b-form-textarea v-else
             v-model="yourStandUpYesterday"
             class="memberInputField"
             type="textarea"
           ></b-form-textarea></b-list-group-item>
           <b-list-group-item> <br>Today:
          <p v-if="yourStandUpSubmitted">{{yourStandUpToday}}</p>
           <b-form-textarea v-else
             v-model="yourStandUpToday"
             class="memberInputField"
             type="textarea">
             </b-form-textarea>
             </b-list-group-item>
           <b-list-group-item> <br>Helps:
             <p v-if="yourStandUpSubmitted">{{yourStandUpHelps}}</p>
           <b-form-textarea v-else
             v-model="yourStandUpHelps"
             class="memberInputField"
             type="textarea">
           </b-form-textarea>
           </b-list-group-item>
           <b-list-group-item>
             <b-button @click="submitYourStandUp">Submit Stand Up</b-button>
             <b-button v-b-tooltip.hover title="Edit" id="edit" variant="outline-dark" class="teamEditDel" >✎</b-button>
           </b-list-group-item>
          </b-list-group>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import CalendarView from "./CalendarView";
import SprintStore from "../stores/SprintStore";
import StandUpsStore from "../stores/StandUpsStore";
import Spinner from './error-pages/Spinner';

export default {
  name: "Sprint",
  data() {
    return {
      selectedStandupDay: '',
      notLoading: false,
      sprintLength: 5,
      member1YesterdayText: "",
      member1TodayText: "",
      member1HelpsText: "",
      sprintGoalText: "",
      sprint_notes: "",
      teamName: '',
      sprintInfo: '',
      currentSprintId: 0,
      notes: "",
      standupsDay1:[],
      standupsDay2:[],
      yourStandUpSubmitted: false,
      yourStandUpYesterday: '',
      yourStandUpToday: '',
      yourStandUpHelps: '',
    };
  },


    async mounted(){
      console.log("SprintStore.data.sprintInfo: ", SprintStore.data.sprintInfo)
    
      this.notLoading = true
      setTimeout(() => {
        this.notLoading = false
      }, 2000)
       this.sprintInfo = SprintStore.data.sprintInfo
       this.sprint_notes = this.sprintInfo[1].sprint_notes
       this.teamName = await SprintStore.data.teamName
       this.currentSprintId = await SprintStore.data.sprintId
     //load in current standUps from stand up store
       this.currentSprintInfo(this.currentSprintId)

      //this should get all standups for this sprint and store them in the StandUpsStore
      StandUpsStore.methods.getStandups(this.sprintInfo[1].id)

      //populate standups for each day
      let day1 = []
      StandUpsStore.data.allStandupsForThisSprint[0].map((standup) =>{
        if(standup.dayInSprint === 1){
          day1.push(standup)
        }
      })
 
      this.standupsDay1.push(day1)
    },

  methods: {
    async teamsUsersRoute() {
      let response = await fetch("http://localhost:3000/teams_users", {
        credentials: "include"
      });
      console.log(
        "the button is go:",
        response,
        response.status,
        response.data
      );
    },

    async currentSprintInfo() {
      let response = await StandUpsStore.methods.getSprintInfo(this.currentSprintId)
      console.log("response to currentSprintIno in sprint vue:", response)
    },

    addTeamMember(event) {
      console.log("add team member function")
      let parent = document.getElementById('sprintCardParent')
    },

    submitYourStandUp(){
      this.yourStandUpSubmitted = true
    }

  },
  components: {
    CalendarView,
  }
};
</script>

<style scoped>

a {
  color: #1b3b2d;
}

.jumbotron {
  background-color: #ebebeb;
}

.sprint {
  border-radius: 5px;
  padding: 10px;
  margin: 2%;
}

.sprintNotes {
  width: 66%;
  margin-left: 16.5%;
}

.sprintCardDiv {
  text-align: left;
}

#sprintCardUpBtn {
  margin: 2% 30%;
  border: 1px solid #333333;
  border-radius: 5px;
}

#sprintCardUpBtn:hover {
  background-color: #dddddd;
}

.postASprintBtn {
  margin-left: 66%;
}

.sprintDailyCard {
  float: left;
  margin: 1%;
  margin-bottom: 10%;

}

.sprintDailyCard > img {
  width: 75px;
  height: 75px;
  opacity: .6;
  padding: 1%;
}

.yourCard {
  text-align: left;
  margin-left: 15%;
}
</style>
