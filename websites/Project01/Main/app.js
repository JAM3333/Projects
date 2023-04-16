const linkMenu = document.getElementsByClassName("headerDivSites")[0];
const dropdownBtn = document.getElementsByClassName("dropdown")[0];


dropdownBtn.addEventListener("click", function(){
    dropdownBtn.classList.toggle("active");
    linkMenu.classList.toggle("active");
})