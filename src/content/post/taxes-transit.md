---
publishDate: 2022-10-15T00:00:00Z
author: Nikolaos Gkionis
title: A difficult technical problem to solve
excerpt: A difficult technical problem to solve, multiple divergent paths with a ton of dependencies. This is how we solved it.
image: https://plus.unsplash.com/premium_photo-1677865216186-c6106618ac69?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

## A difficult technical problem to solve

#### The Problem

The NCTS5 team consisted of 2 interaction designers, they were struggling with a highly complicated prototype. They wanted to achieve multi divergent paths and their dependencies.

#### The Solution

In an 'pair programming' session between myself and the 2 interaction designers, we managed to achieve this with nesting if/else statements and creating an array to store the information as described below. We also recorded the session and hosted it on our community slack channel and used this as a stepping stone for more 'pair programming' sessions.

## Screenshots

![A screenshot](src/assets/images/tax01.png 'A screenshot of the guarantee sub-journey')
<br>

The radio buttons lead to divergent paths in the rest of the user journey, this can be achieved in the `routes.js` file.

```js
router.post('/guarantee-type', function (req, res) {
  const selectedGuarantee = req.session.data.guaranteeType;

  const guaranteeRadio = [
    '(0) Guarantee waiver',
    '(1) Comprehensive guarantee',
    '(2) Individual guarantee',
    '(4) Flat-rate voucher redirect(guarantee-reference)',
    '(5) Guarantee waiver',
    '(9) Individual guarantee with multiple usage',
    '(J) Guarantee not required for the journey',
  ];

  if (guaranteeRadio.includes(selectedGuarantee)) {
    res.redirect('guarantee-reference');
  } else if (selectedGuarantee == '(8) Guarantee not required for certain public bodies') {
    res.redirect('other-reference');
  } else if (selectedGuarantee == '(3) Individual guarantee in cash or other means of payment') {
    res.redirect('other-reference-cash-deposit');
  } else {
    res.redirect('check-answers');
  }
});

router.post('/guarantee-type-xi', function (req, res) {
  const selectedGuarantee = req.session.data.guaranteeType;

  const guaranteeRadio = [
    '(0) Guarantee waiver',
    '(1) Comprehensive guarantee',
    '(2) Individual guarantee',
    '(4) Flat-rate voucher redirect(guarantee-reference)',
    '(5) Guarantee waiver',
    '(J) Guarantee not required for the journey',
  ];

  if (guaranteeRadio.includes(selectedGuarantee)) {
    res.redirect('guarantee-reference');
  } else {
    let guaranteeType = req.session.data.guaranteeType;

    if (guaranteeType == '(8) Guarantee not required for certain public bodies') {
      res.redirect('other-reference');
    } else if (guaranteeType == '(3) Individual guarantee in cash or other means of payment') {
      res.redirect('other-reference-cash-deposit');
    } else res.redirect('check-answers');
  }
});

router.post('/guarantee-reference', function (req, res) {
  const selectedGuarantee2 = req.session.data.guaranteeType;

  const guaranteeRadio2 = [
    '(0) Guarantee waiver',
    '(1) Comprehensive guarantee',
    '(2) Individual guarantee',
    '(4) Flat-rate voucher redirect(guarantee-reference)',
    '(9) Individual guarantee with multiple usage (for CTC only)',
  ];

  if (guaranteeRadio2.includes(selectedGuarantee2)) {
    res.redirect('access-code');
  } else {
    res.redirect('check-answers');
  }
});
```

![A screenshot](src/assets/images/tax02.png 'A screenshot of the guarantee sub-journey')
<br>

![A screenshot](src/assets/images/tax03.png 'A screenshot of the guarantee sub-journey')
<br>

![A screenshot](src/assets/images/tax04.png 'A screenshot of the guarantee sub-journey')
<br>

![A screenshot](src/assets/images/tax05.png 'A screenshot of the guarantee sub-journey')
<br>

![A screenshot](src/assets/images/tax06.png 'A screenshot of the guarantee sub-journey')
<br>

#### The add another feature

At the end of the journey the user is presented with an option to add another guarantee to their declaration, this can go up to 9 different guarantees and then the user needs to remove one before adding another.

![A screenshot](src/assets/images/tax07.png 'A screenshot of the guarantee sub-journey')
<br>

#### A D.R.Y (A Do not Repeat Yourself)

The code required to add and remove guarantees from the declaration. This code builds an array and indexes the guarantee, every time the user adds another guarantee, the maximum is set to nine. This code will be made part of every other add another pattern required through the prototype in the Routes, Transport, House Consignments and so on.

```js
router.get('/:index/remove-guarantee', function (req, res) {
  res.render(path.resolve(__dirname, 'remove-guarantee'));
});

router.post('/:index/remove-guarantee', function (req, res) {
  let removeGuarantee = req.session.data.removeGuarantee;
  const guarantees = req.session.data.guaranteeArray || [];

  if (removeGuarantee == 'Yes' && guarantees.length) {
    const deleteIndex = req.params.index - 1;
    const maxIndex = guarantees.length || 0;

    if (deleteIndex <= maxIndex) {
      guarantees.splice(deleteIndex, 1);

      req.session.data.guaranteeArray = guarantees;
      req.session.data.guaranteeCount = guarantees.length;
    }
  }

  res.redirect('../add-another-guarantee');
});

router.get('/:index/check-answers', function (req, res) {
  const data = req.session.data;
  const index = parseInt(req.params.index);
  const guarantees = data.guaranteeArray || [];

  if (!guarantees.length) {
    return res.redirect('../add-another-guarantee');
  }

  const guarantee = guarantees[req.params.index - 1] || {};

  req.session.data = {
    ...data,
    ...guarantee,
    editGuarantee: index,
  };

  res.redirect('../check-answers');
});

router.post('/check-answers', function (req, res) {
  const data = req.session.data;
  const guarantees = data.guaranteeArray || [];

  const guarantee = {
    guaranteeType: data.guaranteeType,
    guaranteeReference: data.guaranteeReference,
    liabilityAmount: data.liabilityAmount,
    accessCode: '****',
  };

  if (data.editGuarantee) {
    guarantees[data.editGuarantee - 1] = guarantee;
  } else {
    guarantees.push(guarantee);
    data.guaranteeArray = guarantees;
    data.guaranteeCount = guarantees.length;
  }

  delete data.editGuarantee;

  res.redirect('add-another-guarantee');
});

router.post('/add-another-guarantee-route', function (req, res) {
  var sessionData = req.session.data;
  var guaranteeArray = sessionData.guaranteeArray || [];
  var guarantee = {
    id: guaranteeArray.length + 1,
    guarantee: sessionData.guaranteeType,
  };
  guaranteeArray.push(guarantee);
  sessionData.guaranteeArray = guaranteeArray;
  sessionData.guaranteeCount = guaranteeArray.length;
  res.redirect('add-another-guarantee');
});

router.post('/guarantee-added-tir', function (req, res) {
  res.redirect('../task-list-3');
});

router.post('/add-another-guarantee', function (req, res) {
  delete req.session.data.editGuarantee;

  if (req.session.data.addAnotherGuarantee == 'Yes') {
    res.redirect('guarantee-type');
  } else {
    res.redirect('../task-list');
  }
});

router.post('/add-another-guarantee', function (req, res) {
  delete req.session.data.editGuarantee;

  if (req.session.data.guaranteeCount == '9') {
    res.redirect('../task-list');
  } else {
    res.redirect('guarantee-type');
  }
});
```

#### The declaration summary

At the end of the journey the user is then taken back to the declaration summary where they can see that they have completed this section.

![A screenshot](src/assets/images/tax08.png 'A screenshot of the declaration summary')
<br>
