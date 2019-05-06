document.querySelector('.navbar-nav').addEventListener("click", hideMenu);

function hideMenu() {
	document.querySelector('.navbar-collapse').classList.remove('show');
}

function showMoreCakes() {
	document.getElementById("additional-cakes").style.display = "block";
	document.getElementById("button-showMoreCakes").style.display = "none";
}

function showMoreSweets() {
	document.getElementById("additional-sweets").style.display = "block";
	document.getElementById("button-showMoreSweets").style.display = "none";
}