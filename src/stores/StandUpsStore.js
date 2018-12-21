const jwtDecode = require('jwt-decode');

const StandUpsStore = {
  data: {
    selectedStandupDay: '',
    allStandupsForThisSprint: [],
  },

  methods: {
    /**
     * Get one user's info based on token id for component
     */
    async getSprintInfo(sprintId) {
      await fetch(`http://localhost:3000/standUps/${sprintId}`, {
        credentials: 'include',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }).then(async (response) => {
        const sprintData = await response.json();
        console.log('get one user store info:', sprintData);
        return sprintData;
      });
    },

    async getStandups(sprintId) {
      await fetch(`http://localhost:3000/standUps/${sprintId}`, {
        credentials: 'include',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }).then(async (response) => {
        const standups = await response.json();
        console.log('getStandups response', standups);
        StandUpsStore.data.allStandupsForThisSprint.push(standups);
        return standups;
      });
    },


  },
};

export default StandUpsStore;
