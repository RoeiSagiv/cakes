const axios = require('axios').default;

const BASE_URL = 'http://localhost:5000';

const Role = {
  Admin: 'Admin',
  User: 'User'
};

function signup(data) {
  return axios.post(`${BASE_URL}/api/signup`,
  {
      firstName: data.firstName, lastName: data.lastName, username: data.username,
      password: data.password, role: data.role, email: data.email, address: data.address
  })
  .then(response => {
      localStorage.setItem('signedup-token', response.data.token);
      localStorage.setItem('signedup-token-expiration', Date.now() + 2 * 60 * 60 * 1000);
      return response.data
  })
  .catch(err => Promise.reject('signing up failed!'));
}

function login(data){
  return fetch('/api/auth', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrer: 'no-referrer',
    body: JSON.stringify({username: data.username, password: data.password, rememberMe: data.rememberMe}),
})
    .catch(err => Promise.reject('the authentication is failed!'));
}

function getCartProducts(cart){
  return axios.post(`${BASE_URL}/api/products`, {cart})
        .then(response => response.data);
}

function getProducts() {
  return axios.get(`${BASE_URL}/api/products`)
      .then(response => response.data);
}

module.exports ={
  Role,
  signup,
  login,
  getCartProducts,
  getProducts,
}