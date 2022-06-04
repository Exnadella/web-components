import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-email-field.js';
import { EmailField } from '../src/vaadin-lit-email-field.js';

const validAddresses = [
  'email@example.com',
  'firstname.lastname@example.com',
  'email@subdomain.example.com',
  'firstname+lastname@example.com',
  'email@123.123.123.123',
  '1234567890@example.com',
  'email@example-one.com',
  '_______@example.com',
  'email@example.name',
  'email@example.museum',
  'email@example.co.jp',
  'firstname-lastname@example.com',
];

const invalidAddresses = [
  'plainaddress',
  '#@%^%#$@#$@#.com',
  '@example.com',
  'Joe Smith <email@example.com>',
  'email.example.com',
  'email@example@example.com',
  'あいうえお@example.com',
  'email@example.com (Joe Smith)',
  'email@example..com',
  'email@example',
];

const runTests = (tag) => {
  describe('default', () => {
    let emailField;

    beforeEach(async () => {
      emailField = fixtureSync(`<${tag}></${tag}>`);
      await nextRender();
    });

    describe('valid email addresses', () => {
      validAddresses.forEach((address) => {
        it(`should treat ${address} as valid`, async () => {
          emailField.value = address;
          await nextFrame();
          emailField.validate();
          expect(emailField.invalid).to.be.false;
        });
      });
    });

    describe('invalid email addresses', () => {
      invalidAddresses.forEach((address) => {
        it(`should treat ${address} as invalid`, async () => {
          emailField.value = address;
          await nextFrame();
          emailField.validate();
          expect(emailField.invalid).to.be.true;
        });
      });
    });
  });

  describe('custom pattern', () => {
    let emailField;

    beforeEach(async () => {
      emailField = fixtureSync(`<${tag} pattern=".+@example.com"></${tag}>`);
      await nextRender();
    });

    it('should not override custom pattern', () => {
      expect(emailField.pattern).to.equal('.+@example.com');
    });
  });

  describe('invalid', () => {
    let field;

    beforeEach(async () => {
      field = fixtureSync(`<${tag} invalid></${tag}>`);
      await nextRender();
    });

    it('should not remove "invalid" state when ready', () => {
      expect(field.invalid).to.be.true;
    });
  });

  describe('invalid with value', () => {
    let field;

    beforeEach(async () => {
      field = fixtureSync(`<${tag} invalid value="foo@example.com"></${tag}>`);
      await nextRender();
    });

    it('should not remove "invalid" state when ready', () => {
      expect(field.invalid).to.be.true;
    });
  });
};

describe('EmailField + Polymer', () => {
  runTests('vaadin-email-field');
});

describe('EmailField + Lit', () => {
  const LIT_TAG = 'vaadin-lit-email-field';

  customElements.define(
    LIT_TAG,
    class extends EmailField {
      static get is() {
        return LIT_TAG;
      }
    },
  );

  runTests(LIT_TAG);
});
