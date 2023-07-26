// Made by Hodaya & Ezra Chayo
'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

// reading files
let login = fs.readFileSync(`${__dirname}/templates/login/login.html`);
const home = fs.readFileSync(`${__dirname}/templates/home/home.html`);
const forms = fs.readFileSync(`${__dirname}/templates/forms/forms.html`);
const generalCss = fs.readFileSync(`${__dirname}/templates/css/general.css`);
const loginCss = fs.readFileSync(`${__dirname}/templates/css/login.css`);
const homeCss = fs.readFileSync(`${__dirname}/templates/css/home.css`);
const formsCss = fs.readFileSync(`${__dirname}/templates/css/forms.css`);
const loginJs = fs.readFileSync(`${__dirname}/templates/login/login.js`);
const formsJs = fs.readFileSync(`${__dirname}/templates/forms/forms.js`);
let usersData = fs
  .readFileSync(`${__dirname}/templates/login/users.txt`)
  .toString();
usersData = usersData.split('\r\n');
let formsData = fs.readFileSync('./templates/forms/form-data.json');
formsData = JSON.parse(formsData);

// server code:
const server = http
  .createServer((req, res) => {
    let pathName = req.url;
    console.log(pathName);

    if (pathName === '/') {
      res.writeHead(200, { 'content-type': 'text/html' });
      res.write(login);
      res.end();
    } else if (pathName === '/home/home.html') {
      res.writeHead(200, { 'content-type': 'text/html' });
      res.write(home);
      res.end();
    } else if (pathName === '/forms/forms.html') {
      res.writeHead(200, { 'content-type': 'text/html' });
      res.write(forms);
      res.end();
    } else if (pathName === '/css/general.css') {
      res.writeHead(200, { 'content-type': 'text/css' });
      res.write(generalCss);
      res.end();
    } else if (pathName === '/css/login.css') {
      res.writeHead(200, { 'content-type': 'text/css' });
      res.write(loginCss);
      res.end();
    } else if (pathName === '/css/home.css') {
      res.writeHead(200, { 'content-type': 'text/css' });
      res.write(homeCss);
      res.end();
    } else if (pathName === '/css/forms.css') {
      res.writeHead(200, { 'content-type': 'text/css' });
      res.write(formsCss);
      res.end();
    } else if (pathName === '/login.js') {
      res.writeHead(200, { 'content-type': 'text/javascript' });
      res.write(loginJs);
      res.end();
    } else if (pathName === '/forms/forms.js') {
      res.writeHead(200, { 'content-type': 'text/javascript' });
      res.write(formsJs);
      res.end();
    } else if (pathName === '/message') {
      // get user name and password from login
      const body = [];
      req.on('data', chunk => {
        body.push(chunk);
      });
      req.on('end', () => {
        try {
          // we get here when all the data has been received (all chunks)
          console.log('No more data');
          console.log(body);
          const obj = JSON.parse(body);

          // do something with JSON
          console.log(obj);
          const name = obj[0];
          const pass = obj[1];

          console.log(name);
          console.log(pass);

          let connect = false;
          // check if the userName and password exist and correct
          for (let i = 0; i < usersData.length && !connect; i++) {
            const tmpUser = usersData[i].split('-');
            console.log(tmpUser);
            if (tmpUser[0] === name && tmpUser[1] === pass) {
              connect = true;
            }
          }
          let result = {};
          result.isConnect = connect;
          // return answer to client
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        } catch (error) {
          console.error(error.message);
        }
      });
    } else if (pathName === '/forms/askData') {
      // sending list to forms page
      const body2 = [];
      req.on('data', chunk => {
        body2.push(chunk);
      });
      req.on('end', () => {
        try {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(formsData));
        } catch (error) {
          console.error(error.message);
        }
      });
    } else if (pathName === '/forms/add') {
      // adding new customer to the list and to data
      const body3 = [];
      req.on('data', chunk => {
        body3.push(chunk);
        let newCus = JSON.parse(body3);
        console.log(newCus);

        let newObj = {
          customerNum: newCus[0],
          name: newCus[1],
          email: newCus[2],
          customerId: newCus[3],
          phoneNum: newCus[4],
        };
        formsData.push(newObj);
      });
      req.on('end', () => {
        try {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(formsData));
          // rewriting the new data to the json file
          formsData = JSON.stringify(formsData);
          fs.writeFile(
            `${__dirname}/templates/forms/form-data.json`,
            formsData,
            err => {
              if (err) throw err;
              console.log('New data added');
            }
          );
        } catch (error) {
          console.error(error.message);
        }
      });
    } else {
      res.writeHead(404, { 'content-type': 'text/html' });
      res.end('<h1>Page not found</h1>');
    }
  })
  .listen(3000);
