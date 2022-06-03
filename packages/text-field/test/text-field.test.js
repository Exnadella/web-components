import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-text-field.js';
import { TextField } from '../src/vaadin-lit-text-field.js';

const runTests = (tag) => {
  let textField, input;

  beforeEach(async () => {
    textField = fixtureSync(`<${tag}></${tag}>`);
    await nextRender();
    input = textField.inputElement;
  });

  describe('properties', () => {
    describe('native', () => {
      async function assertAttrCanBeSet(prop, value) {
        textField[prop] = value;
        await nextFrame();

        const attrValue = input.getAttribute(prop);

        if (value === true) {
          expect(attrValue).not.to.be.null;
        } else if (value === false) {
          expect(attrValue).to.be.null;
        } else if (value) {
          expect(attrValue).to.be.equal(String(value));
        }
      }

      ['pattern', 'placeholder', 'value', 'title'].forEach((prop) => {
        it(`should set string property ${prop}`, async () => {
          textField[prop] = 'foo';
          await nextFrame();
          expect(input[prop]).to.be.equal('foo');
        });
      });

      ['disabled'].forEach((prop) => {
        it(`should set boolean property ${prop}`, async () => {
          textField[prop] = true;
          await nextFrame();
          expect(input[prop]).to.be.true;

          textField[prop] = false;
          await nextFrame();
          expect(input[prop]).to.be.false;
        });
      });

      ['maxlength', 'minlength'].forEach((prop) => {
        it(`should set numeric attribute ${prop}`, async () => {
          await assertAttrCanBeSet(prop, 2);
        });
      });

      ['autocomplete'].forEach((prop) => {
        it(`should set boolean attribute ${prop}`, async () => {
          await assertAttrCanBeSet(prop, 'on');
        });
      });

      ['autocapitalize'].forEach((prop) => {
        it(`should set boolean attribute ${prop}`, async () => {
          await assertAttrCanBeSet(prop, 'none');
        });
      });

      ['autocomplete', 'autocorrect', 'readonly', 'required'].forEach((prop) => {
        it(`should set boolean attribute ${prop}`, async () => {
          await assertAttrCanBeSet(prop, true);
          await assertAttrCanBeSet(prop, false);
        });
      });
    });

    describe('clear button', () => {
      it('should set clearButtonVisible to false by default', () => {
        expect(textField.clearButtonVisible).to.be.false;
      });

      it('should clear the value when clear button is clicked', async () => {
        textField.clearButtonVisible = true;
        textField.value = 'Foo';
        await nextFrame();
        textField.$.clearButton.click();
        expect(textField.value).not.to.be.ok;
      });

      it('should clear the native input value when clear button is clicked', async () => {
        textField.clearButtonVisible = true;
        textField.value = 'Foo';
        await nextFrame();
        textField.$.clearButton.click();
        expect(input.value).to.equal('');
      });

      it('should dispatch input event when clear button is clicked', () => {
        const inputSpy = sinon.spy();
        textField.addEventListener('input', inputSpy);
        textField.clearButtonVisible = true;
        textField.value = 'Foo';
        textField.$.clearButton.click();
        expect(inputSpy.calledOnce).to.be.true;
      });

      it('should dispatch change event when clear button is clicked', () => {
        const changeSpy = sinon.spy();
        textField.addEventListener('change', changeSpy);
        textField.clearButtonVisible = true;
        textField.value = 'Foo';
        textField.$.clearButton.click();
        expect(changeSpy.calledOnce).to.be.true;
      });

      it('should prevent default on clear button click', () => {
        const event = new Event('click', { cancelable: true });
        textField.$.clearButton.dispatchEvent(event);
        expect(event.defaultPrevented).to.be.true;
      });
    });

    describe('binding', () => {
      it('default value should be empty string', () => {
        expect(textField.value).to.be.equal('');
      });

      it('setting input value updates value', () => {
        input.value = 'foo';
        input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true, composed: true }));
        expect(textField.value).to.be.equal('foo');
      });

      it('setting input value updates has-value attribute', async () => {
        textField.value = 'foo';
        await nextFrame();
        expect(textField.hasAttribute('has-value')).to.be.true;
      });

      it('setting value to undefined should not update has-value attribute', async () => {
        textField.value = undefined;
        await nextFrame();
        expect(textField.hasAttribute('has-value')).to.be.false;
      });

      it('setting value to undefined should clear the native input value', async () => {
        textField.value = 'foo';
        await nextFrame();

        textField.value = undefined;
        await nextFrame();

        expect(input.value).to.equal('');
      });

      it('setting empty value does not update has-value attribute', async () => {
        textField.value = '';
        await nextFrame();
        expect(textField.hasAttribute('has-value')).to.be.false;
      });

      // User could accidentally set a 0 or false value
      it('setting number value updates has-value attribute', async () => {
        textField.value = 0;
        await nextFrame();
        expect(textField.hasAttribute('has-value')).to.be.true;
      });

      it('setting boolean value updates has-value attribute', async () => {
        textField.value = false;
        await nextFrame();
        expect(textField.hasAttribute('has-value')).to.be.true;
      });

      it('setting label updates has-label attribute', async () => {
        textField.label = 'foo';
        await nextFrame();
        expect(textField.hasAttribute('has-label')).to.be.true;
      });

      it('setting label to empty string does not update has-label attribute', async () => {
        textField.label = '';
        await nextFrame();
        expect(textField.hasAttribute('has-label')).to.be.false;
      });

      it('setting label to null does not update has-label attribute', async () => {
        textField.label = null;
        await nextFrame();
        expect(textField.hasAttribute('has-label')).to.be.false;
      });

      it('setting helper updates has-helper attribute', async () => {
        textField.helperText = 'foo';
        await nextFrame();
        expect(textField.hasAttribute('has-helper')).to.be.true;
      });

      it('setting helper to empty string does not update has-helper attribute', async () => {
        textField.helperText = '';
        await nextFrame();
        expect(textField.hasAttribute('has-helper')).to.be.false;
      });

      it('setting helper to null does not update has-helper attribute', async () => {
        textField.helperText = null;
        await nextFrame();
        expect(textField.hasAttribute('has-helper')).to.be.false;
      });

      it('setting helper with slot updates has-helper attribute', async () => {
        const helper = document.createElement('div');
        helper.setAttribute('slot', 'helper');
        helper.textContent = 'foo';
        textField.appendChild(helper);
        await nextFrame();
        expect(textField.hasAttribute('has-helper')).to.be.true;
      });

      it('setting errorMessage updates has-error-message attribute', async () => {
        textField.invalid = true;
        textField.errorMessage = 'foo';
        await nextFrame();
        expect(textField.hasAttribute('has-error-message')).to.be.true;
      });

      it('setting errorMessage to empty string does not update has-error-message attribute', async () => {
        textField.invalid = true;
        textField.errorMessage = '';
        await nextFrame();
        expect(textField.hasAttribute('has-error-message')).to.be.false;
      });

      it('setting errorMessage to null does not update has-error-message attribute', async () => {
        textField.invalid = true;
        textField.errorMessage = null;
        await nextFrame();
        expect(textField.hasAttribute('has-error-message')).to.be.false;
      });
    });

    describe('required', () => {
      beforeEach(async () => {
        textField.required = true;
        await nextFrame();
      });

      it('should focus on required indicator click', () => {
        textField.shadowRoot.querySelector('[part="required-indicator"]').click();
        expect(textField.hasAttribute('focused')).to.be.true;
      });
    });

    describe('autoselect', () => {
      it('default value of autoselect should be false', () => {
        expect(textField.autoselect).to.be.false;
      });

      it('should not select content on focus when autoselect is false', async () => {
        textField.value = '123';
        await nextFrame();
        input.dispatchEvent(new CustomEvent('focus', { bubbles: false }));
        await aTimeout(1);
        expect(input.selectionEnd - input.selectionStart).to.equal(0);
      });

      it('should select content on focus when autoselect is true', async () => {
        textField.value = '123';
        textField.autoselect = true;
        await nextFrame();
        input.dispatchEvent(new CustomEvent('focus', { bubbles: false }));
        await aTimeout(1);
        expect(input.selectionEnd - input.selectionStart).to.equal(3);
      });
    });

    describe('validation constraints', () => {
      it('should not validate the field when minlength is set', async () => {
        textField.minlength = 2;
        await nextFrame();
        expect(textField.invalid).to.be.false;
      });

      it('should not validate the field when maxlength is set', async () => {
        textField.maxlength = 6;
        await nextFrame();
        expect(textField.invalid).to.be.false;
      });

      it('should validate the field when invalid after minlength is changed', async () => {
        textField.invalid = true;
        await nextFrame();

        const spy = sinon.spy(textField, 'validate');
        textField.minlength = 2;
        await nextFrame();

        expect(spy.calledOnce).to.be.true;
      });

      it('should validate the field when invalid after maxlength is changed', async () => {
        textField.invalid = true;
        await nextFrame();

        const spy = sinon.spy(textField, 'validate');
        textField.maxlength = 6;
        await nextFrame();

        expect(spy.calledOnce).to.be.true;
      });

      it('should update "invalid" state when "required" is removed', async () => {
        textField.required = true;
        await nextFrame();
        textField.validate();
        expect(textField.invalid).to.be.true;

        textField.required = false;
        await nextFrame();
        expect(textField.invalid).to.be.false;
      });

      it.skip('should update "invalid" state when "minlength" is removed', () => {
        textField.minlength = 5;
        textField.value = 'foo';

        // There seems to be no way to make minlength/maxlength trigger invalid
        // state in a native input programmatically. It can only become invalid
        // if the user really types into the input. Using MockInteractions,
        // triggering `input` and/or `change` events didn't seem to help.
        // Since vaadin-text-field currently relies on inputElement.checkValidity()
        // for setting the `invalid` property (thus simulating native behaviour)
        // there is currently no way to test this.

        // Let's enable this test if we find a way to make this invalid first

        textField.validate();
        expect(textField.invalid).to.be.true; // Fails here

        textField.minlength = undefined;
        expect(textField.invalid).to.be.false;
      });

      it.skip('should update "invalid" state when "maxlength" is removed', () => {
        textField.maxlength = 3;
        textField.value = 'foobar';

        // There seems to be no way to make minlength/maxlength trigger invalid
        // state in a native input programmatically. It can only become invalid
        // if the user really types into the input. Using MockInteractions,
        // triggering `input` and/or `change` events didn't seem to help.
        // Since vaadin-text-field currently relies on inputElement.checkValidity()
        // for setting the `invalid` property (thus simulating native behaviour)
        // there is currently no way to test this.

        // Let's enable this test if we find a way to make this invalid first

        textField.validate();
        expect(textField.invalid).to.be.true; // Fails here

        textField.maxlength = undefined;
        expect(textField.invalid).to.be.false;
      });

      it('should update "invalid" state when "pattern" is removed', async () => {
        textField.value = '123foo';
        textField.pattern = '\\d+';
        await nextFrame();
        textField.validate();
        expect(textField.invalid).to.be.true;

        textField.pattern = '';
        await nextFrame();
        expect(textField.invalid).to.be.false;
      });

      it('should update "invalid" state when a constraint is removed even while other constraints are still active', async () => {
        textField.required = true;
        textField.pattern = '\\d*';
        await nextFrame();
        textField.validate();
        expect(textField.invalid).to.be.true;

        textField.required = false;
        await nextFrame();
        expect(textField.invalid).to.be.false;
      });
    });
  });

  describe('value property', () => {
    it('should not consider updating the value as user input if the value is not changed', async () => {
      const event = new Event('input', {
        bubbles: true,
        cancelable: true,
      });
      input.dispatchEvent(event);

      textField.value = 'foo';
      await nextFrame();
      expect(input.value).to.equal('foo');
    });
  });

  describe('events', () => {
    it('should not stop native input events', () => {
      const inputSpy = sinon.spy();
      textField.addEventListener('input', inputSpy);

      const inputEvent = new Event('input', { bubbles: true, composed: true });
      input.dispatchEvent(inputEvent);

      expect(inputSpy.calledOnce).to.be.true;
      expect(inputSpy.calledWith(inputEvent)).to.be.true;
    });
  });

  describe(`methods`, () => {
    it('should clear the value when clear() is called', async () => {
      textField.value = 'Foo';
      await nextFrame();
      textField.clear();
      expect(textField.value).not.to.be.ok;
    });

    it('should clear the value of native input when clear() is called', async () => {
      textField.value = 'Foo';
      await nextFrame();
      textField.clear();
      expect(input.value).to.equal('');
    });
  });

  describe('theme attribute', () => {
    it('should propagate theme attribute to input container', async () => {
      const container = textField.shadowRoot.querySelector('[part="input-field"]');
      textField.setAttribute('theme', 'align-center');
      await nextFrame();
      expect(container.getAttribute('theme')).to.equal('align-center');
    });
  });
};

describe('TextField + Polymer', () => {
  runTests('vaadin-text-field');
});

describe('TextField + Lit', () => {
  const LIT_TAG = 'vaadin-lit-text-field';

  customElements.define(
    LIT_TAG,
    class extends TextField {
      static get is() {
        return LIT_TAG;
      }
    },
  );

  runTests(LIT_TAG);
});
