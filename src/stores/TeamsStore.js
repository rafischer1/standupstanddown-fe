var jwtDecode = require('jwt-decode')

const TeamsStore = {
  data: {
    //store the id of the team being edited here on click of the accociated button.
    //then you can render the edit form conditionally based on the value's presence.
    teamToEdit: null,
    usersTeams: [],
    test: "test",
    memberTeams: [],
  },

  methods: {
    //this data will be present when the el is mounted. gets the teams the user is a part of and puts them in the usersTeams property.
    refreshUsersTeams: async function(){
      this.loading = true
      this.usersTeams = await TeamsStore.methods.getTeams()
      console.log("profile.vue: getTeams: ", this.usersTeams)
      this.loading = false
    },

    async getTeams() {
      return fetch("http://localhost:3000/teams", {
        credentials: 'include',
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }).then(async (response) => {
        console.log("response getTeams: ", response)
        let resJson = await response.json()
        TeamsStore.data.usersTeams = resJson
        // console.log("resJson: ", resJson)
        return resJson
      })
    },

    async getMemberTeams(id) {
      return fetch(`http://localhost:3000/user_teams/${id}`, {
        credentials: 'include',
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }).then(async (response) => {
        console.log("response getTeams: ", response)
        let resJson = await response.json()
        return resJson
      })
    },

    async createTeam(teamToAdd) {
      console.log("createTeam: ", teamToAdd)
      const tokenDecoded = jwtDecode(document.cookie.split('=')[1])
      console.log("tokenDecoded", tokenDecoded)
      const body = {
        name: teamToAdd,
        creator_id: tokenDecoded.id,
      }
      await fetch(`http://localhost:3000/teams/${teamToAdd}`, {
        credentials: 'include',
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then(async (response) => {
        let resJson = await response.json()
        if (response.status === 200) {
          // push that stuff
          // TeamsStore.data.usersTeams.push(response.body
          console.log("resJson: ", resJson)
          console.log("resJson.name: ", resJson.name)
          return resJson.name
        } else {
          // something bad happened
          console.log("response; ", response)
        }
      })
    },


    async deleteTeam(id) {
      console.log("in the delete teamStore w/ id:", id)
      id = parseInt(id)
      await fetch(`http://localhost:3000/teams/${id}`, {
        credentials: 'include',
        method: "DELETE",
      })
        .then((response) => {
          if (response.status === 401) {
            alert(`Error: ${response.status}: ${response.statusText}`)
          }
        })
    },

    async editTeam(id, name) {
      const tokenDecoded = jwtDecode(document.cookie.split('=')[1])
      const body = {
        name,
        creator_id: tokenDecoded.id,
      }
      await fetch(`http://localhost:3000/teams/${id}`, {
        credentials: 'include',
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((response) => {
          if (response.status === 401) {
            alert(`Error: ${response.status}: ${response.statusText}`)
          }
        })
    },

    async getTeamMembers(id){
      return fetch(`http://localhost:3000/teams_users/${id}`, {
        credentials: 'include',
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }).then(async (response) => {
        console.log("response getTeamMembers: ", response.body)
        let resJson = await response.json()
        console.log("resJson: ", resJson)
        return resJson.body
      })
    },

    async joinTeam(teamName) {
      let body = {
        team_name: teamName,
      }
      console.log("in the joinTeam for team:", teamName)
      return fetch(`http://localhost:3000/teams_users`, {
        credentials: 'include',
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }).then((res) => {
        console.log("join a team res:", res)
      })
    },
  },
};

export default TeamsStore;
