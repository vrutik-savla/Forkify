'use strict';
import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    //1)Loading Recipe
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message} (${response.status})`); //Even if it's fail, we get response & data object & then we can use it for customised error messages
    return data; //This data is the resolved value of the promise which'll get return
  } catch (err) {
    throw err; //IMPORTANT to re-throw the error, so if error occurred here, this will be throwed in importing file & we can catch this error their & handle it. (In model.js)
  }
};

/*
export const getJSON = async function (url) {
  try {
    //1)Loading Recipe
    const fetchPro = fetch(url);
    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message} (${response.status})`); //Even if it's fail, we get response & data object & then we can use it for customised error messages
    return data; //This data is the resolved value of the promise which'll get return
  } catch (err) {
    throw err; //IMPORTANT to re-throw the error, so if error occurred here, this will be throwed in importing file & we can catch this error their & handle it. (In model.js)
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message} (${response.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
*/
