'use strict';

// check that userName contains letters only
function checkUserName(str) {
  if (str.length >= 2) {
    return /^([a-zA-Z]+)$/.test(str);
  }
}

// check that password length is above 8 and contain at least one letter and number
function checkUserPassword(str) {
  if (str.length >= 8) {
    return /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(str);
  }
}


// if the inputs are good - sending them to the server
const btn_login = document.getElementById('Btnlog');
btn_login.addEventListener('click', function (e) {
  e.preventDefault();
  let userName = document.querySelector('.user');
  let userPassword = document.querySelector('.password');
  const nameVal = userName.value.trim();
  const passVal = userPassword.value.trim();
  const data = [nameVal, passVal];

  if (checkUserName(nameVal) && checkUserPassword(passVal)) {
    fetch('message', {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.isConnect) {
          window.location.href = '/home/home.html';
        } else {
          document.querySelector('p').innerHTML = 'שם משתמש או סיסמה לא נכונים';
        }
      })
      .catch(err => {
        console.log(err);
      });
  }else{document.querySelector('p').innerHTML = 'שם משתמש או סיסמה לא נכונים';}
});
