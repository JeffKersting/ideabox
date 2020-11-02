
// QUERY SELECTORS
var showStarredButton = document.querySelector(".show-favorite");
var titleInput = document.querySelector(".title-input");
var bodyInput = document.querySelector(".body-input");
var saveButton = document.querySelector(".save-button");
var searchInput = document.querySelector(".search-input");
var searchButton = document.querySelector(".search-button");
var ideaGrid = document.querySelector(".idea-grid");

// var retrievedObject = JSON.parse(localStorage.getItem("localIdeas"));
var savedIdeas = [];

// EVENT LISTENERS
saveButton.addEventListener('click', saveIdea);
bodyInput.addEventListener('keyup', enableSaveButton);
ideaGrid.addEventListener("click", checkEventTarget);
window.addEventListener('load', pageLoad);
showStarredButton.addEventListener('click', showStarredIdeas)

// FUNCTIONS
function saveIdea() {
  if (titleInput.value && bodyInput.value) {
    var idea = new Idea(titleInput.value, bodyInput.value, Date.now());
    savedIdeas.push(idea);
  };
  titleInput.value = "";
  bodyInput.value = "";
  saveButton.disabled = true;
  showIdeas(savedIdeas);
  idea.saveToStorage();
};

function enableSaveButton() {
  if (titleInput.value.length > 0 && bodyInput.value.length > 0) {
    saveButton.disabled = false;
  } else {
    saveButton.disabled = true;
  };
};

function showIdeas(array) {
  ideaGrid.innerHTML = "";
  for (var i = 0; i < array.length; i++) {
    if (array[i].star === false) {
      var star = "assets/star.svg";
    } else if (array[i].star === true) {
      var star = "assets/star-active.svg";
    };
    ideaGrid.innerHTML += `
      <article class="idea-container" id=${array[i].id}>
        <span class="favorite-delete">
          <img src=${star} class="like" alt="Like this idea!">
          <img src="assets/delete.svg" class="delete" alt="Delete this idea!">
        </span>
        <p class="idea-title">${array[i].title}</p>
        <p class="idea-body">${array[i].body}</p>
        <span class="comment">
          <img src="assets/comment.svg" class="comment-button" alt="comment button">
          <label for="comment-button">Comment</label>
        </span>
      </article>
    `
  };
};

function checkEventTarget(event) {
  var eventTarget = event.target;
  if (eventTarget.classList.contains("delete")) {
    deleteIdea(eventTarget);
  } else if (eventTarget.classList.contains("like")) {
    favoriteIdea(eventTarget);
  };
};

function deleteIdea(target) {
  var id = parseInt(target.parentNode.parentNode.id);
  // var idea = localStorage.key(id);
    for (var i = 0; i < savedIdeas.length; i++) {
      if (savedIdeas[i].id === id) {
        savedIdeas[i].deleteFromStorage();
        savedIdeas.splice(i, 1);
      };
    };
    showIdeas(savedIdeas);
};

function favoriteIdea(target) {
  var id = parseInt(target.parentNode.parentNode.id);
    for (var i = 0; i < savedIdeas.length; i++) {
      if (savedIdeas[i].id === id) {
        savedIdeas[i].star = !savedIdeas[i].star;
        var idea = JSON.parse(localStorage.getItem(id));
        idea.star = !idea.star;
        localStorage.setItem(id, JSON.stringify(idea));
      };
    };
    showIdeas(savedIdeas)
};

function pageLoad() {
  if (localStorage) {
    for (var i = 0; i < localStorage.length; i++){
      var key = localStorage.key(i);
      var idea = JSON.parse(localStorage.getItem(key));
      var id = idea.id;
      savedIdeas.push(new Idea(idea.title, idea.body, id, idea.star));
    }
    showIdeas(savedIdeas);
  }
}


function showStarredIdeas() {
  if (showStarredButton.innerText === "Show Starred Ideas"){
    showStarredButton.innerText = "Show All Ideas"
    var starredIdeas = savedIdeas.filter(x => x.star);
  showIdeas(starredIdeas);
  }else{
    showStarredButton.innerText = "Show Starred Ideas"
    showIdeas(savedIdeas);
  }

}

