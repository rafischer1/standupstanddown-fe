<template>
<div>
  <SignUp v-show="isSeen && !currentlyLoading && !loggedIn"/>
        <!-- createSprint view component rendered here-->
     <!-- <CreateSprint v-show="noInfo" class="createSprint" /> -->
  <div class="profile" v-show="!isSeen || !currentlyLoading && loggedIn">
    <Spinner v-show="currentlyLoading" id="pacman" name="ball-scale-multiple" color="#292b2c"/>
    <b-alert id="alert" show dismissible fade v-show="isWarning" variant="warning">{{this.errorMessage}}</b-alert>
    <b-container  class="bv-example-row">
    <b-row >
        <b-col>
          <h4>Create a Team</h4>
          <div class="teamFields">
            <b-form :info="'info'" @submit="addTeam" inline >
              <label for="teamName"  value="name"/>
              <b-input id="inputLive"  name="teamName"
                 v-model="teamName" placeholder="Team Name">Team
              </b-input>

              <b-button type="submit" class="teamBtn" variant="dark" >+</b-button>
              <b-form-invalid-feedback id="inputLiveFeedback">
                 Enter at least 4 letters
              </b-form-invalid-feedback>
             </b-form>
           </div>

        </b-col>
        
        <b-col>  
         <h4>Creator</h4>
          
          <div class='teamsList'>
            <b-list-group class="yourTeamsGroup" track-by="$index"  v-for="team in this.usersTeams" :key="team.id">
              <b-list-group-item class="yourTeamsItem" button  @click="goToSprint(team.id, team.name)">{{team.name[0].toUpperCase() + team.name.substring(1)}}

              </b-list-group-item>
               <b-button v-b-tooltip.hover title="Edit" id="edit" variant="outline-dark" class="teamEditDel" @click="showModal(team.name)">✎</b-button>
                <b-button v-b-tooltip.hover title="Delete" variant="outline-dark" class="teamEditDel" @click="deleteTeam(team.name)">🗑</b-button>
      
               </b-list-group>
           </div>
         </b-col>
          <b-col>  
         <h4>Member</h4>
          <div class='teamsList'>
            <b-list-group class="yourTeamsGroup" track-by="$index"  v-for="team in this.memberTeams" :key="team.id">
              <b-list-group-item class="yourTeamsItem" button  @click="goToSprint(team.id, team.name)">
                {{team.name[0].toUpperCase() + team.name.substring(1)}}
              </b-list-group-item>
            </b-list-group>
           </div>
         </b-col>

      </b-row>
       <hr />
       <b-row>
           <b-col>
           <b-alert hide=true variant="warning">Please enter a longer team name</b-alert>
           <div class="teamActions"><h4>Join a Team</h4>
             <div class="joinTeam">
               <b-form  inline>
                 <label for="Team Name" value="name"/>
                 <b-input v-model="joinTeamName" placeholder="Team Name">Team</b-input>
                 <b-button @click="joinTeam(joinTeamName)" class="teamBtn" variant="dark">+</b-button>
               </b-form>

            </div>
          </div>
        </b-col>
        </b-row>
    </b-container>


    <!-- modal below here -->
     <b-modal ref="editModal" hide-footer title="Edit Team Name">
       <div class="d-block text-center">{{teamName.toUpperCase(1)}}
       <hr />
         <b-input id="modalInput" v-model="editModalInput" type="text">
         </b-input>
       </div>
       <b-btn class="mt-3" variant="outline-dark" block @click="hideModal &&editTeam(teamName)">Edit</b-btn>
    </b-modal>

     <!-- modal below here as last rendered thing in component -->
     <b-modal v-show="!isWarning"
        ref="postSprintModal"
        id="postSprintModal"
        hide-footer
        variant="dark"
        title="Set First Sprint for New Team"
        effect="fade/zoom"
      >
        <div>
          Sprint Length: {{rangeValue}} Stand Ups
          <b-form-input type="range" variant="info" min="5" max="10" step="1" v-model="rangeValue"></b-form-input>
        </div>
        <hr>
        <div>Sprint Goal</div>
        <b-form-input type="text" v-model="rangeGoal"></b-form-input>
        <hr>
         <div>Sprint Notes</div>
        <b-form-input type="text" v-model="sprintNotes"></b-form-input>
        <br>
        <b-button
          @click="postSprint(3, +(rangeValue), rangeGoal, sprintNotes)"
          variant="outline-info text-dark"
          value="submit"
        >{{teamName.toUpperCase() + teamName.substring(1)}}...Get Agile!</b-button>
      </b-modal>

    </div>
  </div>
</template>

<script>
import Vue from 'vue'
const jwtDecode = require('jwt-decode')
import Spinner from './error-pages/Spinner'
import TeamsStore from "../stores/TeamsStore"
import SprintStore from "../stores/SprintStore"
import SignUp from './SignUp'

export default {
  name: 'Profile',
  data () {
    return {
      reactive: true,
      rangeValue: 5,
      rangeGoal: "",
      sprintNotes: "",
      isSeen: true,
      currentlyLoading: false,
      usersTeams: [],
      memberTeams: [],
      model:{},
      teamName: '',
      selected: null,
      editModalInput: '',
      loggedIn: true,
      joinTeamName: '',
      current_user_id: 0,
      errorMessage: '',
      isWarning: false,
      lastCreatedTeamId: 1,
    }
  },

  mounted() {
    if (!document.cookie) {
      this.currentlyLoading = true
    } else {
     this.currentlyLoading = false
    this.current_user_id = jwtDecode(document.cookie.split('=')[1]).id
    this.refreshUsersTeams()
    }
    
    
  },

  methods: {
    async refreshUsersTeams() {
      // first clear the existing arrays of teams
      this.usersTeams = []
      this.memberTeams = []
      if (this.currentlyLoading = false) {
        setTimeout(() => this.currentlyLoading = true, 3000)
      }
      this.currentlyLoading = false
      //second get all teams for user
      let res = await TeamsStore.methods.getTeams()
     
      await res.map((team) => {
        if (team.creator_id === jwtDecode(document.cookie.split('=')[1]).id) {
           team.name[0].toUpperCase() + team.name.substring(1)
           this.loggedIn = true
           this.isSeen = false
           this.currentlyLoading = false
           this.lastCreatedTeamId = res[res.length - 1].id
      
           // last set usersTeams array
          return this.usersTeams.push(team)
        }
      }) 
      
      // get all teams for which one is a member but not creator 
      let memberTeamResponse = await TeamsStore.methods.getMemberTeams(this.current_user_id)
      memberTeamResponse.forEach((team) => {
        if (team.creator_id !== this.current_user_id) {
          this.memberTeams.push(team)
        }
      })
      //set new errorMessage
      this.errorMessage = TeamsStore.data.errorMessage
      console.log("this.errorMessage", this.errorMessage)
      if (this.errorMessage !== '') {
        this.isWarning = true
        setTimeout(() => this.isWarning = false, 5000)
      }
     
    },

    async addTeam(event) {
      event.preventDefault()
      await TeamsStore.methods.createTeam(this.teamName)
      this.refreshUsersTeams()
      this.openModal(this.teamName)
      this.teamName = ''
      return event.target.reset()
    },

    async goToSprint(teamId, teamName){
      console.log("Go to sprint id: ", teamId)
      await SprintStore.methods.getSprint(teamId, teamName)
      this.$router.push('/sprint')
      //redirect to sprints page which is retrieving data from the Sprint Store
    },

    deleteTeam(name) {
       this.usersTeams.map(async (team) => {
         if (team.name === name.toLowerCase()) {
          await TeamsStore.methods.deleteTeam(team.id)
          return this.refreshUsersTeams()
         }
       })

    },
    editTeam() {
      this.usersTeams.map(async (team) => {
        if (team.name === this.teamName.toLowerCase()) {
          await TeamsStore.methods.editTeam(team.id, this.editModalInput.toLowerCase())
          this.editModalInput = ''
          this.teamName = ''
          this.hideModal()
          return this.refreshUsersTeams()
        }
      })
    },

    joinTeam(name) {
      TeamsStore.methods.joinTeam(this.joinTeamName)
      return this.refreshUsersTeams()
    },

    showModal(name) {
      this.teamName = name
      console.log("modal name:", name)
      this.$refs.editModal.show()
    },

     hideModal() {
      this.teamName = ''
      this.$refs.editModal.hide()
    },

     hideSprintModal () {
      this.$refs.postSprintModal.hide()
    },
    
   openModal(name) {
      this.$refs.postSprintModal.show()
    },

    postSprint(lastCreatedTeamId, sprint_length, sprint_goal, sprintNotes) {
      if (!sprint_goal) {
        alert("Please enter a Sprint Goal for your team's betterment");
      }
      console.log(
        "in the postSprint in the sprint component:",
        this.lastCreatedTeamId,
        sprint_length,
        sprint_goal
      );
      
      SprintStore.methods.postSprint(this.lastCreatedTeamId, sprint_length, sprint_goal, this.sprintNotes);
      this.hideSprintModal();
      this.rangeValue = 5;
      this.rangeGoal = "";
      this.sprintNotes = "";
    },


  },
  components: {
    SignUp,

  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.profile {
  border: 5px double #28284e;
  border-radius: 5px;
  padding: 10px;
  margin: 5%;
}

.profile:hover {
  border: 5px double #284e45;
}

.form-control {
  width: 90%;
}

.teamFields {
  font-weight: bold;
  padding: 5%;
}

.joinTeam {
  width: 50%;
  margin-left: 25%;
}

.teamBtn {
  margin: 1%;
}

.yourTeamsGroup {
  padding: 2%;
  display: flex;
  flex-direction: row;
}

.yourTeamsItem {
  width: 100%;
  margin: 1% 0px;
  font-weight: bold;
  border-radius: 15px;
  border: 1px solid #3b3b3b
}

.yourTeamsItem:focus {
  outline: none;
}

.yourTeamsItem:hover {
  cursor: pointer;
  border: 1px solid #2f4f4f;
}

#pacman {
  margin: 2% 0 0 50%;
}

.teamEditDel {
 font-size: 20px;
  border: none;
  border-radius: 5px;
   margin-left: 1%;
}

#edit {
  font-size: 24px;
}

.teamEditDel:hover {
  background-color: #b5c6d6;
  border: none;
  border-radius: 5px;
}

#modalInput {
  width: 100%;
}

#alert{
  transition: .55s ease-in-out;
}
</style>
