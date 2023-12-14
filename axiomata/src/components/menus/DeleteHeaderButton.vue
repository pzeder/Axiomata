<template>
    <div class="header-delete-button"> Löschen </div>
</template>

<style>
.header-delete-button {
  display: grid;
  place-items: center;
  font-size: 1vw;
  padding: 1vw;
  background: red;
  border: 0.3vw solid rgb(44, 44, 44);
  border-radius: 1vw;
  user-select: none;
  margin-left: 1.5vw;
  opacity: 85%;
  transform: scale(1);
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.header-delete-button:hover {
  opacity: 100%;
  transform: scale(1.1);
}
</style>