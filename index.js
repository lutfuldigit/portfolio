//  mobile navition show and hide toggle
const mobileLink = document.querySelector(".mobile-link");
const mobileNav = document.querySelector(".mobile-nav-cont");


mobileNav.addEventListener("click", (e) => {
    if (!e.target.classList.contains("fa-bars")) return;
    mobileLink.classList.toggle("active-mobile");

    e.stopPropagation();

})


document.addEventListener("click", (e) => {
    // If the menu is open AND the user clicked outside the menu
    if (mobileLink.classList.contains("active-mobile") && !mobileLink.contains(e.target)) {
        mobileLink.classList.remove("active-mobile");
    }
});

//  page interseption 
const interElem = document.querySelectorAll(".intersept")
const observer = new IntersectionObserver(roll);

function roll(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {

            entry.target.classList.add("intersept-show")
        }
    });
}

interElem.forEach(entry => {
    observer.observe(entry)
})


//  about us text
const aboutEle = document.querySelector(".About-us");
const moreAboutText = document.querySelector(".more-about");
const btn1 = document.querySelector(".read-about");
const btn2 = document.querySelector(".showless-about");

aboutEle.addEventListener("click", (e) => {
    if (e.target.classList.contains("read-about")) {
        moreAboutText.classList.add("showmore-about");
        btn1.style.display = "none";
        btn2.style.display = "block";
    } else if (e.target.classList.contains("showless-about")) {
        moreAboutText.classList.remove("showmore-about");
        btn2.style.display = "none";
        btn1.style.display = "block";
    }
})