<script>
export default {
  name: "textSlider",
  props:{
    first: Object,
    second: Object,
    third: Object,
  }
}
</script>

<template>
  <main class="container">
    <p>Bonjour, je suis</p>
    <section class="animation">
      <div class="first"><div :style="{backgroundColor: first.color}">{{ first.text || 'first' }}</div></div>
      <div class="second"><div :style="{backgroundColor: second.color}">{{ second.text || 'second' }}</div></div>
      <div class="third"><div :style="{backgroundColor: third.color}">{{ third.text || 'third' }}</div></div>
    </section>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Roboto:700');

body {
  font-family:'Roboto',sans-serif;
  background-color: #131417;
}
p {
  text-shadow: 0 0 7px rgba(255,255,255,.3), 0 0 3px rgba(255,255,255,.3);
}
.container {
  font-size: 2.26rem;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
}

.animation {
  height:50px;
  overflow:hidden;
  margin-left: 1rem;
  color: white;
}

.animation > div > div {
  padding: 0.25rem 0.75rem;
  height:2.81rem;
  margin-bottom: 2.81rem;
  display:inline-block;
}

.animation div:first-child {
  animation: text-animation 12s infinite;
}

@keyframes text-animation {
  0% {margin-top: 0;}
  10% {margin-top: 0;}
  20% {margin-top: -5.62rem;}
  30% {margin-top: -5.62rem;}
  40% {margin-top: -11.24rem;}
  60% {margin-top: -11.24rem;}
  70% {margin-top: -5.62rem;}
  80% {margin-top: -5.62rem;}
  90% {margin-top: 0;}
  100% {margin-top: 0;}
}

/* MODE TELEPHONE */
@media screen and (max-width: 600px){
  .container{
    display: block;
    text-align: center;
  }
}
</style>