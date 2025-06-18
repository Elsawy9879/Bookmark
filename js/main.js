var siteName = document.getElementById("bookmarkName");
var siteURL = document.getElementById("bookmarkURL");
var submitBtn = document.getElementById("submitBtn");
var tableContent = document.getElementById("tableBody");
var closeBtn = document.getElementById("closeBtn");
var boxModal = document.querySelector(".box-info");

var bookmarks = [];

if (localStorage.getItem("bookmarksList")) {
  bookmarks = JSON.parse(localStorage.getItem("bookmarksList"));
  displayBookmarks();
}

function displayBookmarks() {
  tableContent.innerHTML = "";
  for (var i = 0; i < bookmarks.length; i++) {
    var url = bookmarks[i].siteURL;
    if (!url.startsWith("http")) {
      url = "https://" + url;
    }

    var row = `
      <tr>
        <td>${i + 1}</td>
        <td>${bookmarks[i].siteName}</td>
        <td>
          <button class="btn btn-visit" data-index="${i}">
            <i class="fa-solid fa-eye pe-2"></i>Visit
          </button>
        </td>
        <td>
          <button class="btn btn-delete pe-2" data-index="${i}">
            <i class="fa-solid fa-trash-can"></i>Delete
          </button>
        </td>
      </tr>
    `;
    tableContent.innerHTML += row;
  }

  var deleteBtns = document.querySelectorAll(".btn-delete");
  for (var j = 0; j < deleteBtns.length; j++) {
    deleteBtns[j].addEventListener("click", function (e) {
      var i = e.target.dataset.index;
      bookmarks.splice(i, 1);
      localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
      displayBookmarks();
    });
  }

  var visitBtns = document.querySelectorAll(".btn-visit");
  for (var v = 0; v < visitBtns.length; v++) {
    visitBtns[v].addEventListener("click", function (e) {
      var i = e.target.dataset.index;
      var link = bookmarks[i].siteURL;
      if (!link.startsWith("http")) {
        link = "https://" + link;
      }
      window.open(link, "_blank");
    });
  }
}

function clearInputs() {
  siteName.value = "";
  siteURL.value = "";
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

submitBtn.addEventListener("click", function () {
  if (
    siteName.classList.contains("is-valid") &&
    siteURL.classList.contains("is-valid")
  ) {
    var site = {
      siteName: capitalizeFirst(siteName.value),
      siteURL: siteURL.value,
    };
    bookmarks.push(site);
    localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
    displayBookmarks();
    clearInputs();
    siteName.classList.remove("is-valid");
    siteURL.classList.remove("is-valid");
  } else {
    boxModal.classList.remove("d-none");
  }
});

var nameRegex = /^\w{3,}(\s+\w+)*$/;
var urlRegex = /^(https?:\/\/)?(www\.)?\w+\.\w{2,}(\/\S*)?$/;

siteName.addEventListener("input", function () {
  validate(siteName, nameRegex);
});

siteURL.addEventListener("input", function () {
  validate(siteURL, urlRegex);
});

function validate(input, pattern) {
  if (pattern.test(input.value)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
  } else {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
  }
}

function closeModal() {
  boxModal.classList.add("d-none");
}

closeBtn.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeModal();
  }
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("box-info")) {
    closeModal();
  }
});
