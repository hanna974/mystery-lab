import APIservice from "./api-service.js";

const tag = document.getElementById("new_tag_name");
const btn = document.getElementById("btn_new_tag");
const selectTags = document.getElementById("tags");
const tagList = document.getElementById("tag_list");
const checkboxes = document.getElementsByClassName("checkbox");


getChecked("tags");

console.log(tag);

function handleTagCreate(evt) {
  if (!tag.value) alert("hey je veux une valeur");
  APIservice.post("/tag-add", {
    label: tag.value
  })
    .then(resApi => {
      console.log(resApi);
      selectTags.innerHTML += `<option value="${resApi.data._id}">${resApi.data.label}</option>`;
    })
    .catch(errApi => {
      console.log(errApi);
    });
}

btn.onclick = handleTagCreate;


