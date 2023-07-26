'use strict';

let main = document.querySelector('main').innerHTML;

// asking for the list when we get into the page
fetch('askData', {
  method: 'POST',
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(),
})
  .then(res => res.json())
  .then(res => {
    let data = [];
    for (let i in res) {
      data.push(res[i]);
    }
    data.sort((a, b) => a.name.localeCompare(b.name));
    data.forEach(el => {
      document.querySelector('main').innerHTML += `<div class="cus">
    <p>${el.customerNum}</p>
    <p>${el.name}</p>
    <p>${el.email}</p>
    <p>${el.customerId}</p>
    <p>${el.phoneNum}</p>
  </div>`;
    });
  })
  .catch(err => {
    console.log(err);
  });

  // because the fetch, the addEventListener wasn't execute without setTimeOut
  // add new customer code
setTimeout(
  () =>
    document.getElementById('BtnAdd').addEventListener('click', function (el) {
      el.preventDefault();
      let fieldsList = document.querySelectorAll('.input');
      let info = [];
      fieldsList.forEach(el => {
        info.push(el.value);
      });
      if (
        ifAllFieldsNotEmpty(fieldsList) &&
        isLengthIs(fieldsList[3].value, 9)
      ) {
        console.log(info);
        fetch('add', {
          method: 'POST',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(info),
        })
          .then(res => res.json())
          .then(res => {
            // delete the lsat list
            document.querySelector('main').innerHTML = main;
            // create a new list
            let data = [];
            for (let i in res) {
              data.push(res[i]);
            }
            data.sort((a, b) => a.name.localeCompare(b.name));
            data.forEach(el => {
              document.querySelector('main').innerHTML += `<div class="cus">
    <p>${el.customerNum}</p>
    <p>${el.name}</p>
    <p>${el.email}</p>
    <p>${el.customerId}</p>
    <p>${el.phoneNum}</p>
  </div>`;
            });
          })
          .catch(err => {
            console.log(err);
          });
      }
        // document.querySelector('form').innerHTML += '<p>ודא שכל השדות מלאים ושמספר עוסק בעל 9 ספרות</p>';
        // the innerHTML causes the page to refresh
    }),
  100
);

// checking:

// check if all the fields are full or one of them is empty
function ifAllFieldsNotEmpty(fieldsList) {
  let flag = true;
  fieldsList.forEach(el => {
    if (el.value === '') {
      flag = false;
    }
  });
  return flag;
}

// check if str is equal to the length we asked
function isLengthIs(str, len) {
  return str.length === len;
}
