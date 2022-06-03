import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../vaadin-button.js';
import { Button } from '../src/vaadin-lit-button.js';

const runTests = (tag) => {
  let element;

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      element = fixtureSync(`<${tag}></${tag}>`);
      tagName = element.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('role', () => {
    describe('default', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag}>Press me</${tag}>`);
        await nextRender();
      });

      it('should set role attribute to button by default', () => {
        expect(element.getAttribute('role')).to.equal('button');
      });
    });

    describe('custom', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag} role="menuitem">Press me</${tag}>`);
        await nextRender();
      });

      it('should not override custom role attribute', () => {
        expect(element.getAttribute('role')).to.equal('menuitem');
      });
    });
  });

  describe('keyboard', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag}>Press me</${tag}>`);
      await nextRender();
      element.focus();
    });

    ['Enter', 'Space'].forEach((key) => {
      it(`should fire click event on ${key}`, async () => {
        const spy = sinon.spy();
        element.addEventListener('click', spy);

        await sendKeys({ down: key });

        expect(spy.calledOnce).to.be.true;
      });

      it(`should not fire click event on ${key} when disabled`, async () => {
        const spy = sinon.spy();
        element.addEventListener('click', spy);
        element.disabled = true;
        await nextFrame();

        await sendKeys({ down: key });

        expect(spy.called).to.be.false;
      });

      it(`should prevent default behaviour for keydown event on ${key}`, async () => {
        const spy = sinon.spy();
        element.addEventListener('keydown', spy);

        await sendKeys({ down: key });

        const event = spy.firstCall.args[0];
        expect(event).to.be.an.instanceOf(KeyboardEvent);
        expect(event.defaultPrevented).to.be.true;
      });
    });

    it('should not prevent default behaviour for keydown event on non-activation key', async () => {
      const spy = sinon.spy();
      element.addEventListener('keydown', spy);

      await sendKeys({ down: 'ArrowDown' });

      const event = spy.args[0][0];
      expect(event).to.be.an.instanceOf(KeyboardEvent);
      expect(event.defaultPrevented).to.be.false;
    });
  });
};

describe('Button + Polymer', () => {
  runTests('vaadin-button');
});

describe('Button + Lit', () => {
  const LIT_TAG = 'vaadin-lit-button';

  customElements.define(
    LIT_TAG,
    class extends Button {
      static get is() {
        return LIT_TAG;
      }
    },
  );

  runTests(LIT_TAG);
});
