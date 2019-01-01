<template>
  <div class="signUp">
    <h3>Welcome to Stand Up! The <b>Daily Scrum</b> app for remote teams</h3>
    <h4>Easily <b>create</b> and <b>join</b> sprint teams</h4>
    <h5>Review each team member's progress</h5>
      <h5>Address helps to achieve the current <b>sprint goal</b></h5>
      <h5>Access past records in the <b>current sprint</b> for easy and qualitative <b>review</b></h5>
      <h5><b>↓</b> Solidify your status as an <b>Agile</b> pro today <b>↓</b> </h5>
    <b-form>
      <b-button id="signUpBtn" @click="sendToProfile" href="http://localhost:3000/auth/github" variant="alert">Sign In with Github
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/1024px-Octicons-mark-github.svg.png" />
      </b-button>
    </b-form>
  </div>
</template>

<script>
import App from '../App'


let data = App.teamsData
console.log("data:", data)
export default {
  name: 'SignUp',
  data () {
    return {
     
    }
  },
    methods: {
      sendToProfile() {
        this.$router.push('./profile')
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  color: #346951;
}

#signUpBtn {
  outline: none;
  margin-top: 20px;
  border: 1px solid black;
  font-size: 24px;
}

#signUpBtn:hover {
  outline: none;
}

#signUpBtn:active {
  outline: none;
  background-color: #cacaca;
}
.signUp {
  border: 5px double #28284e;
  border-radius: 5px;
  padding: 5%;
  margin: 5%;
  
}
.signUp:hover {
  border: 5px double #284e37;
}

img {
  height: 30px;
  width: 30px;
}
</style>
