const service = axios.create({
  baseURL: "http://localhost:3000"
});

console.log("service =>");
console.log(service); // this is an axios instance
// you will use it to interact with the backend in AJAX
// with the get/post/delete/patch/put verbs ....

export default service;
