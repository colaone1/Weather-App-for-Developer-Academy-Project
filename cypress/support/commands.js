// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Custom command to check if an element is in viewport
Cypress.Commands.add('isInViewport', { prevSubject: true }, (subject) => {
  const bottom = Cypress.$(cy.state('window')).height();
  const rect = subject[0].getBoundingClientRect();

  expect(rect.top).to.be.lessThan(bottom);
  expect(rect.bottom).to.be.greaterThan(0);
  return subject;
});

// Custom command to check if an element is not in viewport
Cypress.Commands.add('isNotInViewport', { prevSubject: true }, (subject) => {
  const bottom = Cypress.$(cy.state('window')).height();
  const rect = subject[0].getBoundingClientRect();

  expect(rect.top).to.be.greaterThan(bottom);
  return subject;
});

// Custom command to check if an element is visible in viewport
Cypress.Commands.add('isVisibleInViewport', { prevSubject: true }, (subject) => {
  const bottom = Cypress.$(cy.state('window')).height();
  const rect = subject[0].getBoundingClientRect();

  expect(rect.top).to.be.lessThan(bottom);
  expect(rect.bottom).to.be.greaterThan(0);
  expect(rect.left).to.be.lessThan(Cypress.$(cy.state('window')).width());
  expect(rect.right).to.be.greaterThan(0);
  return subject;
});

// Custom command to check if an element is not visible in viewport
Cypress.Commands.add('isNotVisibleInViewport', { prevSubject: true }, (subject) => {
  const bottom = Cypress.$(cy.state('window')).height();
  const rect = subject[0].getBoundingClientRect();

  expect(rect.top).to.be.greaterThan(bottom);
  return subject;
});

// Custom command to check if an element is visible
Cypress.Commands.add('isVisible', { prevSubject: true }, (subject) => {
  const rect = subject[0].getBoundingClientRect();
  expect(rect.width).to.be.greaterThan(0);
  expect(rect.height).to.be.greaterThan(0);
  return subject;
});

// Custom command to check if an element is not visible
Cypress.Commands.add('isNotVisible', { prevSubject: true }, (subject) => {
  const rect = subject[0].getBoundingClientRect();
  expect(rect.width).to.be.equal(0);
  expect(rect.height).to.be.equal(0);
  return subject;
});

// Custom command to check if an element is enabled
Cypress.Commands.add('isEnabled', { prevSubject: true }, (subject) => {
  expect(subject[0]).to.not.be.disabled;
  return subject;
});

// Custom command to check if an element is disabled
Cypress.Commands.add('isDisabled', { prevSubject: true }, (subject) => {
  expect(subject[0]).to.be.disabled;
  return subject;
});

// Custom command to check if an element is focused
Cypress.Commands.add('isFocused', { prevSubject: true }, (subject) => {
  expect(subject[0]).to.equal(document.activeElement);
  return subject;
});

// Custom command to check if an element is not focused
Cypress.Commands.add('isNotFocused', { prevSubject: true }, (subject) => {
  expect(subject[0]).to.not.equal(document.activeElement);
  return subject;
});

// Custom command to check if an element has a specific class
Cypress.Commands.add('hasClass', { prevSubject: true }, (subject, className) => {
  expect(subject[0].classList.contains(className)).to.be.true;
  return subject;
});

// Custom command to check if an element does not have a specific class
Cypress.Commands.add('doesNotHaveClass', { prevSubject: true }, (subject, className) => {
  expect(subject[0].classList.contains(className)).to.be.false;
  return subject;
});

// Custom command to check if an element has a specific attribute
Cypress.Commands.add('hasAttribute', { prevSubject: true }, (subject, attribute, value) => {
  if (value) {
    expect(subject[0].getAttribute(attribute)).to.equal(value);
  } else {
    expect(subject[0].hasAttribute(attribute)).to.be.true;
  }
  return subject;
});

// Custom command to check if an element does not have a specific attribute
Cypress.Commands.add('doesNotHaveAttribute', { prevSubject: true }, (subject, attribute) => {
  expect(subject[0].hasAttribute(attribute)).to.be.false;
  return subject;
});

// Custom command to check if an element has a specific style
Cypress.Commands.add('hasStyle', { prevSubject: true }, (subject, property, value) => {
  const computedStyle = window.getComputedStyle(subject[0]);
  expect(computedStyle.getPropertyValue(property)).to.equal(value);
  return subject;
});

// Custom command to check if an element does not have a specific style
Cypress.Commands.add('doesNotHaveStyle', { prevSubject: true }, (subject, property, value) => {
  const computedStyle = window.getComputedStyle(subject[0]);
  expect(computedStyle.getPropertyValue(property)).to.not.equal(value);
  return subject;
});

// Custom command to check if an element has a specific text content
Cypress.Commands.add('hasText', { prevSubject: true }, (subject, text) => {
  expect(subject[0].textContent).to.include(text);
  return subject;
});

// Custom command to check if an element does not have a specific text content
Cypress.Commands.add('doesNotHaveText', { prevSubject: true }, (subject, text) => {
  expect(subject[0].textContent).to.not.include(text);
  return subject;
});

// Custom command to check if an element has a specific value
Cypress.Commands.add('hasValue', { prevSubject: true }, (subject, value) => {
  expect(subject[0].value).to.equal(value);
  return subject;
});

// Custom command to check if an element does not have a specific value
Cypress.Commands.add('doesNotHaveValue', { prevSubject: true }, (subject, value) => {
  expect(subject[0].value).to.not.equal(value);
  return subject;
});

// Custom command to check if an element has a specific placeholder
Cypress.Commands.add('hasPlaceholder', { prevSubject: true }, (subject, placeholder) => {
  expect(subject[0].placeholder).to.equal(placeholder);
  return subject;
});

// Custom command to check if an element does not have a specific placeholder
Cypress.Commands.add('doesNotHavePlaceholder', { prevSubject: true }, (subject, placeholder) => {
  expect(subject[0].placeholder).to.not.equal(placeholder);
  return subject;
});

// Custom command to check if an element has a specific title
Cypress.Commands.add('hasTitle', { prevSubject: true }, (subject, title) => {
  expect(subject[0].title).to.equal(title);
  return subject;
});

// Custom command to check if an element does not have a specific title
Cypress.Commands.add('doesNotHaveTitle', { prevSubject: true }, (subject, title) => {
  expect(subject[0].title).to.not.equal(title);
  return subject;
});

// Custom command to check if an element has a specific alt text
Cypress.Commands.add('hasAlt', { prevSubject: true }, (subject, alt) => {
  expect(subject[0].alt).to.equal(alt);
  return subject;
});

// Custom command to check if an element does not have a specific alt text
Cypress.Commands.add('doesNotHaveAlt', { prevSubject: true }, (subject, alt) => {
  expect(subject[0].alt).to.not.equal(alt);
  return subject;
});

// Custom command to check if an element has a specific href
Cypress.Commands.add('hasHref', { prevSubject: true }, (subject, href) => {
  expect(subject[0].href).to.equal(href);
  return subject;
});

// Custom command to check if an element does not have a specific href
Cypress.Commands.add('doesNotHaveHref', { prevSubject: true }, (subject, href) => {
  expect(subject[0].href).to.not.equal(href);
  return subject;
});

// Custom command to check if an element has a specific src
Cypress.Commands.add('hasSrc', { prevSubject: true }, (subject, src) => {
  expect(subject[0].src).to.equal(src);
  return subject;
});

// Custom command to check if an element does not have a specific src
Cypress.Commands.add('doesNotHaveSrc', { prevSubject: true }, (subject, src) => {
  expect(subject[0].src).to.not.equal(src);
  return subject;
});

// Custom command to check if an element has a specific type
Cypress.Commands.add('hasType', { prevSubject: true }, (subject, type) => {
  expect(subject[0].type).to.equal(type);
  return subject;
});

// Custom command to check if an element does not have a specific type
Cypress.Commands.add('doesNotHaveType', { prevSubject: true }, (subject, type) => {
  expect(subject[0].type).to.not.equal(type);
  return subject;
});

// Custom command to check if an element has a specific name
Cypress.Commands.add('hasName', { prevSubject: true }, (subject, name) => {
  expect(subject[0].name).to.equal(name);
  return subject;
});

// Custom command to check if an element does not have a specific name
Cypress.Commands.add('doesNotHaveName', { prevSubject: true }, (subject, name) => {
  expect(subject[0].name).to.not.equal(name);
  return subject;
});

// Custom command to check if an element has a specific id
Cypress.Commands.add('hasId', { prevSubject: true }, (subject, id) => {
  expect(subject[0].id).to.equal(id);
  return subject;
});

// Custom command to check if an element does not have a specific id
Cypress.Commands.add('doesNotHaveId', { prevSubject: true }, (subject, id) => {
  expect(subject[0].id).to.not.equal(id);
  return subject;
});

// Custom command to check if an element has a specific data attribute
Cypress.Commands.add('hasData', { prevSubject: true }, (subject, attribute, value) => {
  if (value) {
    expect(subject[0].dataset[attribute]).to.equal(value);
  } else {
    expect(subject[0].dataset[attribute]).to.exist;
  }
  return subject;
});

// Custom command to check if an element does not have a specific data attribute
Cypress.Commands.add('doesNotHaveData', { prevSubject: true }, (subject, attribute) => {
  expect(subject[0].dataset[attribute]).to.not.exist;
  return subject;
});

// Custom command to check if an element has a specific aria attribute
Cypress.Commands.add('hasAria', { prevSubject: true }, (subject, attribute, value) => {
  if (value) {
    expect(subject[0].getAttribute(`aria-${attribute}`)).to.equal(value);
  } else {
    expect(subject[0].hasAttribute(`aria-${attribute}`)).to.be.true;
  }
  return subject;
});

// Custom command to check if an element does not have a specific aria attribute
Cypress.Commands.add('doesNotHaveAria', { prevSubject: true }, (subject, attribute) => {
  expect(subject[0].hasAttribute(`aria-${attribute}`)).to.be.false;
  return subject;
});

// Custom command to check if an element has a specific role
Cypress.Commands.add('hasRole', { prevSubject: true }, (subject, role) => {
  expect(subject[0].getAttribute('role')).to.equal(role);
  return subject;
});

// Custom command to check if an element does not have a specific role
Cypress.Commands.add('doesNotHaveRole', { prevSubject: true }, (subject, role) => {
  expect(subject[0].getAttribute('role')).to.not.equal(role);
  return subject;
});

// Custom command to check if an element has a specific tabindex
Cypress.Commands.add('hasTabIndex', { prevSubject: true }, (subject, tabindex) => {
  expect(subject[0].getAttribute('tabindex')).to.equal(tabindex);
  return subject;
});

// Custom command to check if an element does not have a specific tabindex
Cypress.Commands.add('doesNotHaveTabIndex', { prevSubject: true }, (subject, tabindex) => {
  expect(subject[0].getAttribute('tabindex')).to.not.equal(tabindex);
  return subject;
});

// Custom command to check if an element has a specific contenteditable value
Cypress.Commands.add('isContentEditable', { prevSubject: true }, (subject, value) => {
  if (value) {
    expect(subject[0].getAttribute('contenteditable')).to.equal(value);
  } else {
    expect(subject[0].getAttribute('contenteditable')).to.equal('true');
  }
  return subject;
});

// Custom command to check if an element is not contenteditable
Cypress.Commands.add('isNotContentEditable', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('contenteditable')).to.not.equal('true');
  return subject;
});

// Custom command to check if an element has a specific spellcheck value
Cypress.Commands.add('hasSpellcheck', { prevSubject: true }, (subject, value) => {
  if (value) {
    expect(subject[0].getAttribute('spellcheck')).to.equal(value);
  } else {
    expect(subject[0].getAttribute('spellcheck')).to.equal('true');
  }
  return subject;
});

// Custom command to check if an element does not have spellcheck
Cypress.Commands.add('doesNotHaveSpellcheck', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('spellcheck')).to.not.equal('true');
  return subject;
});

// Custom command to check if an element has a specific autocomplete value
Cypress.Commands.add('hasAutocomplete', { prevSubject: true }, (subject, value) => {
  expect(subject[0].getAttribute('autocomplete')).to.equal(value);
  return subject;
});

// Custom command to check if an element does not have autocomplete
Cypress.Commands.add('doesNotHaveAutocomplete', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('autocomplete')).to.not.exist;
  return subject;
});

// Custom command to check if an element has a specific required attribute
Cypress.Commands.add('isRequired', { prevSubject: true }, (subject) => {
  expect(subject[0].hasAttribute('required')).to.be.true;
  return subject;
});

// Custom command to check if an element is not required
Cypress.Commands.add('isNotRequired', { prevSubject: true }, (subject) => {
  expect(subject[0].hasAttribute('required')).to.be.false;
  return subject;
});

// Custom command to check if an element has a specific readonly attribute
Cypress.Commands.add('isReadonly', { prevSubject: true }, (subject) => {
  expect(subject[0].hasAttribute('readonly')).to.be.true;
  return subject;
});

// Custom command to check if an element is not readonly
Cypress.Commands.add('isNotReadonly', { prevSubject: true }, (subject) => {
  expect(subject[0].hasAttribute('readonly')).to.be.false;
  return subject;
});

// Custom command to check if an element has a specific checked attribute
Cypress.Commands.add('isChecked', { prevSubject: true }, (subject) => {
  expect(subject[0].checked).to.be.true;
  return subject;
});

// Custom command to check if an element is not checked
Cypress.Commands.add('isNotChecked', { prevSubject: true }, (subject) => {
  expect(subject[0].checked).to.be.false;
  return subject;
});

// Custom command to check if an element has a specific selected attribute
Cypress.Commands.add('isSelected', { prevSubject: true }, (subject) => {
  expect(subject[0].selected).to.be.true;
  return subject;
});

// Custom command to check if an element is not selected
Cypress.Commands.add('isNotSelected', { prevSubject: true }, (subject) => {
  expect(subject[0].selected).to.be.false;
  return subject;
});

// Custom command to check if an element has a specific multiple attribute
Cypress.Commands.add('isMultiple', { prevSubject: true }, (subject) => {
  expect(subject[0].hasAttribute('multiple')).to.be.true;
  return subject;
});

// Custom command to check if an element is not multiple
Cypress.Commands.add('isNotMultiple', { prevSubject: true }, (subject) => {
  expect(subject[0].hasAttribute('multiple')).to.be.false;
  return subject;
});

// Custom command to check if an element has a specific accept attribute
Cypress.Commands.add('hasAccept', { prevSubject: true }, (subject, accept) => {
  expect(subject[0].getAttribute('accept')).to.equal(accept);
  return subject;
});

// Custom command to check if an element does not have accept
Cypress.Commands.add('doesNotHaveAccept', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('accept')).to.not.exist;
  return subject;
});

// Custom command to check if an element has a specific pattern attribute
Cypress.Commands.add('hasPattern', { prevSubject: true }, (subject, pattern) => {
  expect(subject[0].getAttribute('pattern')).to.equal(pattern);
  return subject;
});

// Custom command to check if an element does not have pattern
Cypress.Commands.add('doesNotHavePattern', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('pattern')).to.not.exist;
  return subject;
});

// Custom command to check if an element has a specific min attribute
Cypress.Commands.add('hasMin', { prevSubject: true }, (subject, min) => {
  expect(subject[0].getAttribute('min')).to.equal(min);
  return subject;
});

// Custom command to check if an element does not have min
Cypress.Commands.add('doesNotHaveMin', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('min')).to.not.exist;
  return subject;
});

// Custom command to check if an element has a specific max attribute
Cypress.Commands.add('hasMax', { prevSubject: true }, (subject, max) => {
  expect(subject[0].getAttribute('max')).to.equal(max);
  return subject;
});

// Custom command to check if an element does not have max
Cypress.Commands.add('doesNotHaveMax', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('max')).to.not.exist;
  return subject;
});

// Custom command to check if an element has a specific step attribute
Cypress.Commands.add('hasStep', { prevSubject: true }, (subject, step) => {
  expect(subject[0].getAttribute('step')).to.equal(step);
  return subject;
});

// Custom command to check if an element does not have step
Cypress.Commands.add('doesNotHaveStep', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('step')).to.not.exist;
  return subject;
});

// Custom command to check if an element has a specific minlength attribute
Cypress.Commands.add('hasMinLength', { prevSubject: true }, (subject, minlength) => {
  expect(subject[0].getAttribute('minlength')).to.equal(minlength);
  return subject;
});

// Custom command to check if an element does not have minlength
Cypress.Commands.add('doesNotHaveMinLength', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('minlength')).to.not.exist;
  return subject;
});

// Custom command to check if an element has a specific maxlength attribute
Cypress.Commands.add('hasMaxLength', { prevSubject: true }, (subject, maxlength) => {
  expect(subject[0].getAttribute('maxlength')).to.equal(maxlength);
  return subject;
});

// Custom command to check if an element does not have maxlength
Cypress.Commands.add('doesNotHaveMaxLength', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('maxlength')).to.not.exist;
  return subject;
});

// Custom command to check if an element has a specific size attribute
Cypress.Commands.add('hasSize', { prevSubject: true }, (subject, size) => {
  expect(subject[0].getAttribute('size')).to.equal(size);
  return subject;
});

// Custom command to check if an element does not have size
Cypress.Commands.add('doesNotHaveSize', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('size')).to.not.exist;
  return subject;
});

// Custom command to check if an element has a specific srcset attribute
Cypress.Commands.add('hasSrcset', { prevSubject: true }, (subject, srcset) => {
  expect(subject[0].getAttribute('srcset')).to.equal(srcset);
  return subject;
});

// Custom command to check if an element does not have srcset
Cypress.Commands.add('doesNotHaveSrcset', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('srcset')).to.not.exist;
  return subject;
});

// Custom command to check if an element has a specific sizes attribute
Cypress.Commands.add('hasSizes', { prevSubject: true }, (subject, sizes) => {
  expect(subject[0].getAttribute('sizes')).to.equal(sizes);
  return subject;
});

// Custom command to check if an element does not have sizes
Cypress.Commands.add('doesNotHaveSizes', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('sizes')).to.not.exist;
  return subject;
});

// Custom command to check if an element has a specific crossorigin attribute
Cypress.Commands.add('hasCrossorigin', { prevSubject: true }, (subject, crossorigin) => {
  expect(subject[0].getAttribute('crossorigin')).to.equal(crossorigin);
  return subject;
});

// Custom command to check if an element does not have crossorigin
Cypress.Commands.add('doesNotHaveCrossorigin', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('crossorigin')).to.not.exist;
  return subject;
});

// Custom command to check if an element has a specific loading attribute
Cypress.Commands.add('hasLoading', { prevSubject: true }, (subject, loading) => {
  expect(subject[0].getAttribute('loading')).to.equal(loading);
  return subject;
});

// Custom command to check if an element does not have loading
Cypress.Commands.add('doesNotHaveLoading', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('loading')).to.not.exist;
  return subject;
});

// Custom command to check if an element has a specific decoding attribute
Cypress.Commands.add('hasDecoding', { prevSubject: true }, (subject, decoding) => {
  expect(subject[0].getAttribute('decoding')).to.equal(decoding);
  return subject;
});

// Custom command to check if an element does not have decoding
Cypress.Commands.add('doesNotHaveDecoding', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('decoding')).to.not.exist;
  return subject;
});

// Custom command to check if an element has a specific referrerpolicy attribute
Cypress.Commands.add('hasReferrerpolicy', { prevSubject: true }, (subject, referrerpolicy) => {
  expect(subject[0].getAttribute('referrerpolicy')).to.equal(referrerpolicy);
  return subject;
});

// Custom command to check if an element does not have referrerpolicy
Cypress.Commands.add('doesNotHaveReferrerpolicy', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('referrerpolicy')).to.not.exist;
  return subject;
});

// Custom command to check if an element has a specific sandbox attribute
Cypress.Commands.add('hasSandbox', { prevSubject: true }, (subject, sandbox) => {
  expect(subject[0].getAttribute('sandbox')).to.equal(sandbox);
  return subject;
});

// Custom command to check if an element does not have sandbox
Cypress.Commands.add('doesNotHaveSandbox', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('sandbox')).to.not.exist;
  return subject;
});

// Custom command to check if an element has a specific srcdoc attribute
Cypress.Commands.add('hasSrcdoc', { prevSubject: true }, (subject, srcdoc) => {
  expect(subject[0].getAttribute('srcdoc')).to.equal(srcdoc);
  return subject;
});

// Custom command to check if an element does not have srcdoc
Cypress.Commands.add('doesNotHaveSrcdoc', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('srcdoc')).to.not.exist;
  return subject;
});

// Custom command to check if an element has a specific allow attribute
Cypress.Commands.add('hasAllow', { prevSubject: true }, (subject, allow) => {
  expect(subject[0].getAttribute('allow')).to.equal(allow);
  return subject;
});

// Custom command to check if an element does not have allow
Cypress.Commands.add('doesNotHaveAllow', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('allow')).to.not.exist;
  return subject;
});

// Custom command to check if an element has a specific allowfullscreen attribute
Cypress.Commands.add('hasAllowfullscreen', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('allowfullscreen')).to.equal('true');
  return subject;
});

// Custom command to check if an element does not have allowfullscreen
Cypress.Commands.add('doesNotHaveAllowfullscreen', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('allowfullscreen')).to.not.equal('true');
  return subject;
});

// Custom command to check if an element has a specific allowpaymentrequest attribute
Cypress.Commands.add('hasAllowpaymentrequest', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('allowpaymentrequest')).to.equal('true');
  return subject;
});

// Custom command to check if an element does not have allowpaymentrequest
Cypress.Commands.add('doesNotHaveAllowpaymentrequest', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('allowpaymentrequest')).to.not.equal('true');
  return subject;
});

// Custom command to check if an element has a specific allowusermedia attribute
Cypress.Commands.add('hasAllowusermedia', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('allowusermedia')).to.equal('true');
  return subject;
});

// Custom command to check if an element does not have allowusermedia
Cypress.Commands.add('doesNotHaveAllowusermedia', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('allowusermedia')).to.not.equal('true');
  return subject;
});

// Custom command to check if an element has a specific allowvr attribute
Cypress.Commands.add('hasAllowvr', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('allowvr')).to.equal('true');
  return subject;
});

// Custom command to check if an element does not have allowvr
Cypress.Commands.add('doesNotHaveAllowvr', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('allowvr')).to.not.equal('true');
  return subject;
});

// Custom command to check if an element has a specific allowwebvr attribute
Cypress.Commands.add('hasAllowwebvr', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('allowwebvr')).to.equal('true');
  return subject;
});

// Custom command to check if an element does not have allowwebvr
Cypress.Commands.add('doesNotHaveAllowwebvr', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('allowwebvr')).to.not.equal('true');
  return subject;
});

// Custom command to check if an element has a specific allowvr attribute
Cypress.Commands.add('hasAllowvr', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('allowvr')).to.equal('true');
  return subject;
});

// Custom command to check if an element does not have allowvr
Cypress.Commands.add('doesNotHaveAllowvr', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('allowvr')).to.not.equal('true');
  return subject;
});

// Custom command to check if an element has a specific allowwebvr attribute
Cypress.Commands.add('hasAllowwebvr', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('allowwebvr')).to.equal('true');
  return subject;
});

// Custom command to check if an element does not have allowwebvr
Cypress.Commands.add('doesNotHaveAllowwebvr', { prevSubject: true }, (subject) => {
  expect(subject[0].getAttribute('allowwebvr')).to.not.equal('true');
  return subject;
}); 