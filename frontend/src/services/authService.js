const { default: http } = require("./httpService");

export async function signupApi(data) {
  return http.post("/user/signup", data).then(({ data }) => data.data);
}

export async function singinApi(data) {
  return http.post("/user/signin", data).then(({ data }) => data.data);
}

export async function getUserApi() {
  return http.get("/user/profile").then(({ data }) => data.data);
}

export async function getAllUsersApi(options) {
  return http.get("/user/list", options).then(({ data }) => data.data);
}

export async function logoutApi() {
  return http.post("/user/logout").then(({ data }) => data);
}

export async function updateProfileApi(data) {
  return http.patch("/user/update", data).then(({ data }) => data.data);
}

export async function uploadAvatarApi(data) {
  return http.post("/user/upload-avatar", data).then(({ data }) => data.data);
}