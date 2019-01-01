<template>
<div class="notFound">
  <p>
    404 - Page Not Found
  </p>
  <b-button variant="dark" href="/profile">Back to Profile</b-button>
</div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.notFound {
  border: 5px double #28284e;
  border-radius: 5px;
  padding: 5%;
  margin: 5%;
}

.notFound:hover {
  border: 5px double #387456;
}

p {
    font-weight: bold;
    font-size: 50px;
    text-align: center;
    color: #1f352d;
}
</style>