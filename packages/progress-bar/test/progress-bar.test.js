import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-progress-bar.js';
import { ProgressBar } from '../src/vaadin-lit-progress-bar.js';

const runTests = (tag) => {
  describe('basic', () => {
    let progress, value;

    beforeEach(async () => {
      progress = fixtureSync(`<${tag}></${tag}>`);
      await nextRender();
      value = progress.shadowRoot.querySelector('[part="value"]');
    });

    it('should have proper scale', async () => {
      progress.value = 0.1;
      await nextFrame();
      expect(value.getBoundingClientRect().width / progress.offsetWidth).to.be.closeTo(0.1, 0.002);
    });

    it('should set progress-value custom variable properly', async () => {
      progress.value = 0.1;
      await nextFrame();
      expect(getComputedStyle(progress).getPropertyValue('--vaadin-progress-value')).to.equal('0.1');
    });

    it('should have proper scale with custom min and max', async () => {
      progress.max = 20;
      progress.min = 10;
      progress.value = 15;
      await nextFrame();
      expect(value.getBoundingClientRect().width / progress.offsetWidth).to.be.closeTo(0.5, 0.002);
      expect(getComputedStyle(progress).getPropertyValue('--vaadin-progress-value')).to.equal('0.5');
    });

    it('should set normalized value to 1 in case of wrong bounds', async () => {
      progress.value = 10;
      progress.max = 12;
      progress.min = 13;
      await nextFrame();
      expect(getComputedStyle(progress).getPropertyValue('--vaadin-progress-value')).to.be.equal('1');
    });

    it('should set normalized value to 1 in case of equal bounds', async () => {
      progress.value = 10;
      progress.max = 10;
      progress.min = 10;
      await nextFrame();
      expect(getComputedStyle(progress).getPropertyValue('--vaadin-progress-value')).to.be.equal('1');
    });

    it('should set normalized value to 0 if the value is undefined', async () => {
      progress.value = undefined;
      await nextFrame();
      expect(getComputedStyle(progress).getPropertyValue('--vaadin-progress-value')).to.be.equal('0');
    });

    it('should set normalized value to 0.5 if the value is 0 and min is -1', async () => {
      progress.min = -1;
      progress.value = 0;
      await nextFrame();
      expect(getComputedStyle(progress).getPropertyValue('--vaadin-progress-value')).to.be.equal('0.5');
    });

    it('should clamp normalized value between 0 and 1', async () => {
      progress.value = -1;
      await nextFrame();
      expect(getComputedStyle(progress).getPropertyValue('--vaadin-progress-value')).to.be.equal('0');

      progress.value = 2;
      await nextFrame();
      expect(getComputedStyle(progress).getPropertyValue('--vaadin-progress-value')).to.be.equal('1');
    });

    it('should set proper aria-valuenow on value change', async () => {
      progress.max = 100;
      progress.value = 50;
      await nextFrame();
      expect(progress.getAttribute('aria-valuenow')).to.equal('50');
    });

    it('should set proper aria-valuemin on min change', async () => {
      progress.max = 100;
      progress.min = 10;
      await nextFrame();
      expect(progress.getAttribute('aria-valuemin')).to.equal('10');
    });

    it('should set proper aria-valuemax on max change', async () => {
      progress.max = 100;
      progress.min = 10;
      await nextFrame();
      expect(progress.getAttribute('aria-valuemax')).to.equal('100');
    });

    it('should set indeterminate attribute', async () => {
      progress.indeterminate = true;
      await nextFrame();
      expect(progress.hasAttribute('indeterminate')).to.be.true;
    });
  });

  describe('progress-bar in column flex', () => {
    let layout;
    let progress;

    beforeEach(async () => {
      layout = fixtureSync(`
        <div style="display: flex; flex-direction: column; align-items: flex-start;">
          <${tag}></${tag}>
        </div>
      `);
      await nextRender();
      progress = layout.firstElementChild;
    });

    it('should have width of the parent', () => {
      expect(progress.offsetWidth).to.equal(layout.offsetWidth);
    });

    it('should not collapse', () => {
      expect(progress.offsetWidth).to.be.above(100);
    });
  });
};

describe('ProgressBar + Polymer', () => {
  runTests('vaadin-progress-bar');
});

describe('ProgressBar + Lit', () => {
  const LIT_TAG = 'vaadin-lit-progress-bar';

  customElements.define(
    LIT_TAG,
    class extends ProgressBar {
      static get is() {
        return LIT_TAG;
      }
    },
  );

  runTests(LIT_TAG);
});
