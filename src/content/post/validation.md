---
author: Nikolaos Gkionis
title: Validation
excerpt: Should prototypes have validation? Yes, they should. At a minimum empty field validation needs to be implemented to ensure branching is accurately rendered.
image: https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

## Should prototypes have validation?

This has long been a debate among interaction designers and other DDaT staff in government. My opinion is that the prototype should be as close to the real service as possible.

Yes, there are cases where such high fidelity is not required; but, if your plan is to add usability testing to your user research, you have to include different levels of fidelity.

#### I recommend the following approach:

• Level 1 – Branching
• Level 2 – Passing data
• Level 3 – Conditional logic
• Level 4 – Error validation

Working on the NCTS phase 5 prototype we have used the `HTML` form validation for empty fields.

```html
<form class="form" method="post">
  <span class="govuk-caption-l">{{ data['guaranteeSummary'] }}</span>
  <fieldset
    class="govuk-fieldset"
    data-required
    data-error=" Enter the Guarantee Reference Number"
    aria-required="true"
  >
    <div class="govuk-form-group">
      <h1 class="govuk-label-wrapper">
        <label class="govuk-label govuk-label--l" for="guaranteeReference">
          What is the Guarantee Reference Number (GRN)?
        </label>
      </h1>
      <div id="guarantee-hint" class="govuk-hint">
        This can be up to 24 characters long and include both letters and numbers. For example,
        01GB01234567890123A1B2C3.
      </div>
      <p>You must make sure this reference is up to date.</p>
      <input
        class="govuk-input govuk-input--width-20"
        id="guaranteeReference"
        name="guaranteeReference"
        type="text"
        aria-describedby="guaranteeReference-hint"
      />
    </div>
  </fieldset>

  <div class="govuk-button-group govuk-!-margin-top-3">
    <button class="govuk-button" data-module="govuk-button">Save and continue</button>
  </div>
</form>
```

Simply put, if the user does not enter information in the input field or select a radio they get an error message.

![A screenshot](src/assets/images/error.png 'A screenshot of the error message')
<br>

However, this approach requires `javaScript` injected in the `/javascripts` folder of the project, named `validation.js`. You can copy the code below or download it via the link on the related content.

```js
// Config
const defaultErrorHeading = 'There is a problem';
const defaultErrorDescription = 'Check the following';
const defaultErrorMessage = 'There is an error';

function clearValidation() {
  $('.govuk-error-summary').remove();

  $('.govuk-form-group--error').each(function () {
    $(this).removeClass('govuk-form-group--error');
  });

  $('.govuk-error-message').each(function () {
    $(this).remove();
  });

  $('.form-group-error').each(function () {
    $(this).removeClass('form-group-error');
  });
}

function checkTextFields(errors) {
  $(document)
    .find('input[type="text"],input[type="password"], textarea')
    .each(function () {
      var $fieldset = $(this).parents('fieldset');
      var label = $(this).parent().find('label').clone().children().remove().end().text();

      if (
        $fieldset.attr('data-required') !== undefined &&
        $(this).val() === '' &&
        !$(this).parent().hasClass('js-hidden')
      ) {
        if ($(this).attr('id') === undefined) {
          $(this).attr('id', $(this).attr('name'));
        }

        errors.push({
          id: $(this).attr('id'),
          name: $(this).attr('name'),
          errorMessage: $fieldset.attr('data-error') || defaultErrorMessage,
          label: label,
          type: 'text, password',
        });
      }
    });
  return;
}

function checkSelectors(errors) {
  var checked = [];

  $(document)
    .find('input[type="radio"], input[type="checkbox"]')
    .each(function () {
      var $fieldset = $(this).parents('fieldset');
      var label = $fieldset.find('legend').clone().children().remove().end().text();

      if ($fieldset.attr('data-required') !== undefined && $fieldset.find(':checked').length === 0) {
        if ($(this).attr('id') === undefined) {
          $(this).attr('id', $(this).attr('name'));
        }

        if (checked.indexOf($(this).attr('name')) < 0) {
          checked.push($(this).attr('name'));
          errors.push({
            id: $(this).attr('id'),
            name: $(this).attr('name'),
            errorMessage: $fieldset.attr('data-error'),
            label: label,
            type: 'text, password',
          });
        }
      }
    });
}

function appendErrorSummary(errors) {
  console.log(errors);
  var summaryNotPresent = $(document).find('.govuk-error-summary').length === 0;
  var errorHTML = errors.reduce((res, error) => res + `<li><a href="#${error.id}">${error.errorMessage}</a></li>`, '');
  var summary =
    '<div class="govuk-error-summary" role="alert" aria-labelledby="error-summary-title" tabindex="-1" data-module="govuk-error-summary">' +
    '<h2 class="govuk-error-summary__title" id="error-summary-title">' +
    defaultErrorHeading +
    '</h2>' +
    '<div class="govuk-error-summary__body">' +
    '<ul class="govuk-list govuk-error-summary__list">' +
    errorHTML +
    '</ul>' +
    '</div>' +
    '</div>';
  if (summaryNotPresent) {
    $('form').before(summary);
  }
}

function appendErrorMessages(errors) {
  for (var i = 0; i < errors.length; i++) {
    const error = errors[i];
    const $input = $(document).find(`#${error.id}`);
    var $formgroup = $input.parents('.govuk-form-group');
    console.log($input);
    console.log($formgroup);
    if ($formgroup.hasClass('govuk-form-group--error')) {
      break;
    }

    $formgroup.addClass('govuk-form-group--error');

    if (
      $formgroup.find('input[type="text"], input[type="password"]').length > 0 ||
      $formgroup.find('textarea').length > 0
    ) {
      if ($formgroup.find('.form-date').length > 0) {
        $formgroup.find('.form-date').before('<span class="gov-uk-error-message">' + error.errorMessage + '</span>');
      } else {
        $input.before('<span class="govuk-error-message">' + error.errorMessage + '</span>');
      }
    } else if ($formgroup.find('input[type="radio"]').length > 0 || $formgroup.find('input[type="checkbox"]')) {
      $formgroup.find('legend').append('<span class="govuk-error-message">' + error.errorMessage + '</span>');
    }
  }
}

$(document).on('submit', 'form', function (e) {
  const requiredFieldsPresent = $(document).find('[data-required]').length > 0;

  clearValidation();

  if (requiredFieldsPresent) {
    const errors = [];

    checkTextFields(errors);
    checkSelectors(errors);
    console.log(errors);

    if (errors.length > 0) {
      e.preventDefault();
      appendErrorSummary(errors);
      appendErrorMessages(errors);
      $(document).scrollTop(0);
    }
  }
});
```

That's all well and good if you want to use `HTML` but what if you are using `nunjucks`? Well, here comes the ExpressJS validator.

A new approach we are going to implement going forward is using the Express.js validator and the `nunjucks` syntax. We have already put this into practice in the Routes section, this is still a work in progress at the time of this post.

This new approach requires that you add the following requirement into your dependencies package.json file `"express-validator": "^6.14.2",` it rearranges alphabetically after you save the file.
