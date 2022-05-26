const system13headlines = document.querySelector(".headline__sys13-text");
const system13Img = document.querySelector(".headline__system13 img");
const devNewsHeadlines = document.querySelector(".headline__dev-text");
const devNewsImg = document.querySelector(".headline__dev-news img");

const blur = function (elements) {
  elements.style.filter = "blur(10px)";
};
const unblur = function (elements) {
  elements.style.filter = "blur(0px)";
};

system13headlines.addEventListener("mouseover", () => {
  blur(system13Img);
});
system13headlines.addEventListener("mouseout", () => {
  unblur(system13Img);
});
system13Img.addEventListener("mouseover", () => {
  blur(system13Img);
});
system13Img.addEventListener("mouseout", () => {
  unblur(system13Img);
});
devNewsHeadlines.addEventListener("mouseover", () => {
  blur(devNewsImg);
});
devNewsHeadlines.addEventListener("mouseout", () => {
  unblur(devNewsImg);
});
devNewsImg.addEventListener("mouseover", () => {
  blur(devNewsImg);
});
devNewsImg.addEventListener("mouseout", () => {
  unblur(devNewsImg);
});
