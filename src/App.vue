<template>
    <div id="app">
    <header>
       <b-navbar  toggleable="md" type="dark" variant="dark">
       <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
       <b-navbar-brand to="/sign-up">StandUP!</b-navbar-brand>
       <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item v-show="loggedIn" to="/sprint">Sprint</b-nav-item>
          <b-nav-item v-show="loggedIn" to="/profile">Your Teams</b-nav-item>
        </b-navbar-nav>
       </b-collapse>
       <div class="userInfoDisplay">
         {{currentUserName.toUpperCase()}}
        </div>
       <b-navbar-nav>
         <b-nav-item  to="/sign-up" v-show="!loggedIn">Sign Up</b-nav-item>
         <b-nav-item v-show="!loggedIn" class="loginBtn" href="http://localhost:3000/auth/github">Login</b-nav-item>
         <b-nav-item  @click="logOut" v-show="loggedIn">Logout</b-nav-item>
         </b-navbar-nav>
         <img :src="currentUserPhoto"  alt="BV"> 
      </b-navbar>
    </header>

    <Spinner v-show="loggingOut" id="pacman" name="ball-scale-multiple" color="#292b2c" />

    <main  v-show="!loggingOut">

      <!-- signUp page will show after logged out and on '/' load -->
      <SignUp v-show="!loggedIn"></SignUp>
     
      <!-- Navbar on top and will render router components through the router-view below - no need to import them -->
      <router-view></router-view>
    </main>
    <footer class="footer">
     <b-navbar toggleable="md" type="dark" variant="dark">
      <span id="cpy">Stand Up! © 2018</span>  <span id="time"></span>
     </b-navbar>
    </footer>
  </div>
</template>

<script>
import UsersStore from "./stores/UsersStore";
import SignUp from './components/SignUp.vue'
const jwtDecode = require('jwt-decode')

export default {
  name: 'App',
  data () {
    return {
      reactive: true,
      loggedIn: false,
      loggingOut: false,
      currentUser: '',
      currentUserName: '',
      currentUserPhoto: 'http://getwallpapers.com/wallpaper/full/0/3/c/12613.jpg',
      currentUserOther: ''
    }
  },
  components: {
    SignUp,
  },

  mounted() {
    this.getUserInfo()
    this.startTime()
  },

  methods: {
    async getUserInfo() {
      const tokenDecoded = jwtDecode(document.cookie.split('=')[1])
      let creatorId = tokenDecoded.id
      if (creatorId !== '') {
        this.loggedIn = true
        this.$router.push('/profile')
      }
      await fetch(`http://localhost:3000/users/${creatorId}`, {
        credentials: 'include',
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }).then(async (response) => {
       this.currentUser = await response.json()
        console.log("get one user store info:", this.currentUser)
        this.currentUserName = this.currentUser.username
        this.currentUserPhoto = this.currentUser.photo
        return this.currentUser
      })
    },
    logOut() {
      console.log("I hit the logout button", document.cookie)
      this.loggingOut = true
        setTimeout(() => {
         this.currentUserName = ''
         this.currentUserPhoto = 'http://getwallpapers.com/wallpaper/full/0/3/c/12613.jpg'
         this.loggedIn = false
         this.loggingOut = false
         this.$router.push('/sign-up')
         }, 4000)            
    },
    startTime() {
      let today = new Date();
      let h = today.getHours();
      let m = today.getMinutes();
      let s = today.getSeconds();
        m = this.checkTime(m);
        s = this.checkTime(s);
      document.getElementById('time').innerHTML =
        h + ":" + m + ":" + s;
      let t = setTimeout(this.startTime, 500);
    },
    checkTime(i) {
      if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
      return i
    }
  }
}
 </script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #202d3a;
}

img {
  height: 75px;
  width: 75px;
  border-radius: 15px;
  margin-right: 2%;
}
.userInfoDisplay {
  color: #ffffff;
  font-size: 24px;
}
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  color: #e4e4e4;
  text-align: center;
}

#pacman {
  margin: 8% 0 0 50%;
}

#time {
  border: 1px solid white;
  padding: .5%;
  border-radius: 15px;
  margin-left: 70%;
 
}

#time:hover {
  cursor: none;
  color: lightgreen;
  border: 1px solid lightgreen;
}

</style>
