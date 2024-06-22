// menu-icons
const menuIcon1 = document.getElementById("menu-icon1");
const menuIcon2 = document.getElementById("menu-icon2");

const navList = document.querySelector('.menu ul');
const verticalNav = document.querySelector('.vertical-nav');
const moreIcon = document.querySelector(".set-more");
const patientContainer = document.querySelector(".patient-container");
const showPat = document.querySelector(".show-patList");
const showDocMenu = document.querySelector(".doctor-menu");

menuIcon1.addEventListener("click", () => {
  menuIcon1.classList.toggle("open");
  navList.classList.toggle("vertical-nav");
  moreIcon.classList.toggle("show-set-more");
  showDocMenu.classList.toggle("show-doc-menu");
  blurBody("nav");
});


// show-patList
if (showPat && patientContainer) {
  showPat.addEventListener("click", () => {
    function slideIn() {
      patientContainer.classList.toggle("tog");
      menuIcon2.classList.toggle("open");
      showPat.classList.toggle("bg-color");
      blurBody("pat");
    }
    setTimeout(slideIn, 100);
  });
} else {
  console.log(`Elements not found ::${showPat +" and "+ patientContainer}`);
}



function blurBody(identifier){
  //this toogle features for the menu and patient list
  if(identifier == "nav"){
    showPat.classList.toggle("zIndex")
  }else{
    document.querySelector("nav").classList.toggle("zIndex");
  }
  document.querySelector(".shadow").classList.toggle("show-shadow");
  document.body.classList.toggle("patList-active");
}
