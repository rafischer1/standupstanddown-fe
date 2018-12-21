const jwtDecode = require('jwt-decode');

const UsersStore = {
  data: {
    teamToEdit: null,
    usersTeams: [],
    test: 'test',
    user: {},
  },

  methods: {
    /**
     * Get one user's info based on token id for component
     */
    async getUserInfo() {
      const tokenDecoded = jwtDecode(document.cookie.split('=')[1]);
      const creatorId = tokenDecoded.id;
      await fetch(`http://localhost:3000/users/${creatorId}`, {
        credentials: 'include',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }).then(async (response) => {
        const user = await response.json();
        return user;
      });
    },

  },
};


export default UsersStore;
