"use strict";

console.log("Hello");

const btnCloseModal = document.querySelector(".btn-understand");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

// console.log(showModal);
const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnCloseModal.addEventListener("click", closeModal);
