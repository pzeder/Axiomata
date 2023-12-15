<template>
    <div class="home" > Home </div>
</template>

<style>
.home {
  display: grid;
  place-items: center;
  margin-bottom: 1vw;
  font-size: 2vw;
  width: 7vw;
  height: 5vw;
  color: rgb(44,44,44);
  user-select: none;
  border: 0.4vw solid rgb(44,44,44);
  border-radius: 1vw;
  transform: scale(1);
  opacity: 90%;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.home:hover {
  transform: scale(1.1);
  opacity: 100%;
}
</style>