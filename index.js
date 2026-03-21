//  mobile navition show and hide toggle
const mobileLink= document.querySelector(".mobile-link");
const mobileNav= document.querySelector(".mobile-nav-cont");


mobileNav.addEventListener("click", (e)=>{
    if(!e.target.classList.contains("fa-bars")) return;
    mobileLink.classList.toggle("active-mobile"); 

        e.stopPropagation(); 

})


document.addEventListener("click", (e) => {
    // If the menu is open AND the user clicked outside the menu
    if (mobileLink.classList.contains("active-mobile") && !mobileLink.contains(e.target)) {
        mobileLink.classList.remove("active-mobile");
    }
});