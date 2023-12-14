<template>
    <div class="home" > Home </div>
</template>

<style>
.home {
  position: fixed;
  display: grid;
  place-items: center;
  font-size: 2vh;
  color: rgb(44,44,44);
  margin-left: 2vw;
  margin-top: 2vw;
  user-select: none;
  border: 0.4vw solid rgb(44,44,44);
  border-radius: 1vw;
  padding: 1vw;
  transform: scale(1);
  opacity: 90%;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.home:hover {
  transform: scale(1.1);
  opacity: 100%;
}
</style>