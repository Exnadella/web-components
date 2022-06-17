import { expect } from '@esm-bundle/chai';
import { arrowDown, arrowUp, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-number-field.js';
import { NumberField } from '../src/vaadin-lit-number-field.js';

const runTests = (tag) => {
  describe('basic', () => {
    let numberField, input, decreaseButton, increaseButton;

    beforeEach(async () => {
      numberField = fixtureSync(`<${tag}></${tag}>`);
      await nextRender();
      input = numberField.inputElement;
      decreaseButton = numberField.shadowRoot.querySelector('[part=decrease-button]');
      increaseButton = numberField.shadowRoot.querySelector('[part=increase-button]');
    });

    describe('native', () => {
      it('should have [type=number]', () => {
        expect(input.type).to.equal('number');
      });

      ['min', 'max'].forEach((attr) => {
        it(`should set numeric attribute ${attr}`, async () => {
          const value = 5;
          numberField[attr] = value;
          await nextFrame();
          expect(input.getAttribute(attr)).to.be.equal(String(value));
        });
      });

      it('should set value with correct decimal places regardless of step', async () => {
        numberField.step = 2;
        numberField.value = 9.99;
        await nextFrame();

        expect(numberField.value).equal('9.99');
      });

      it('should increment value to next multiple of step offset by the min', async () => {
        numberField.step = 3;
        numberField.min = 4;
        numberField.value = 4;
        await nextFrame();

        increaseButton.click();

        expect(numberField.value).equal('7');
      });

      it('should increment value on arrow up', async () => {
        numberField.step = 3;
        await nextFrame();
        arrowUp(input);
        expect(numberField.value).equal('3');
      });

      it('should decrement value on arrow down', async () => {
        numberField.step = 3;
        await nextFrame();
        arrowDown(input);
        expect(numberField.value).equal('-3');
      });

      it('should not change value on arrow keys when readonly', async () => {
        numberField.readonly = true;
        numberField.value = 0;
        await nextFrame();

        arrowUp(input);
        expect(numberField.value).to.be.equal('0');

        arrowDown(input);
        expect(numberField.value).to.be.equal('0');
      });
    });

    describe('value control buttons', () => {
      it('should increase value by 1 on plus button click', async () => {
        numberField.value = 0;
        await nextFrame();

        increaseButton.click();

        expect(numberField.value).to.be.equal('1');
      });

      it('should dispatch change event on minus button click', () => {
        const changeSpy = sinon.spy();
        numberField.addEventListener('change', changeSpy);

        decreaseButton.click();
        expect(changeSpy.callCount).to.equal(1);
      });

      it('should dispatch change event on plus button click', () => {
        const changeSpy = sinon.spy();
        numberField.addEventListener('change', changeSpy);

        increaseButton.click();
        expect(changeSpy.callCount).to.equal(1);
      });

      it('should dispatch single value-changed event on minus button click', async () => {
        const spy = sinon.spy();
        numberField.addEventListener('value-changed', spy);

        decreaseButton.click();
        await nextFrame();

        expect(spy.callCount).to.equal(1);
      });

      it('should dispatch single value-changed event on plus button click', async () => {
        const spy = sinon.spy();
        numberField.addEventListener('value-changed', spy);

        increaseButton.click();
        await nextFrame();

        expect(spy.callCount).to.equal(1);
      });

      it('should not focus input when a button is clicked', () => {
        const spy = sinon.spy(input, 'focus');
        increaseButton.click();
        expect(spy.called).to.be.false;
      });

      it('should increase value by 0.2 when step is 0.2 on plus button click', async () => {
        numberField.step = 0.2;
        numberField.value = 0.6;
        await nextFrame();

        increaseButton.click();

        expect(numberField.value).to.be.equal('0.8');
      });

      it('should adjust value to exact step on plus button click', async () => {
        numberField.step = 0.2;
        numberField.value = 0.5;
        await nextFrame();

        increaseButton.click();

        expect(numberField.value).to.be.equal('0.6');
      });

      it('should decrease value by 1 on minus button click', async () => {
        numberField.value = 0;
        await nextFrame();

        decreaseButton.click();

        expect(numberField.value).to.be.equal('-1');
      });

      it('should decrease value by 0.2 on minus button click', async () => {
        numberField.value = 0;
        numberField.step = 0.2;
        await nextFrame();

        decreaseButton.click();

        expect(numberField.value).to.be.equal('-0.2');
      });

      it('should adjust value to exact step on minus button click', async () => {
        numberField.value = 7;
        numberField.step = 2;
        await nextFrame();

        decreaseButton.click();

        expect(numberField.value).to.be.equal('6');
      });

      it('should adjust decimals based on the step value when control button is pressed', async () => {
        numberField.value = 1;
        numberField.step = 0.001;
        await nextFrame();

        increaseButton.click();
        expect(numberField.value).to.be.equal('1.001');
      });

      it('should adjust decimals based on the min value when control button is pressed', async () => {
        numberField.value = 1;
        numberField.step = 0.001;
        numberField.min = 0.0001;
        await nextFrame();

        increaseButton.click();
        expect(numberField.value).to.be.equal('1.0001');
      });

      it('should not increase value on plus button click when max value is reached', async () => {
        numberField.value = 0;
        numberField.max = 0;
        await nextFrame();

        increaseButton.click();

        expect(numberField.value).to.be.equal('0');
      });

      it('should not decrease value on minus button click when min value is reached', async () => {
        numberField.value = 0;
        numberField.min = 0;
        await nextFrame();

        decreaseButton.click();

        expect(numberField.value).to.be.equal('0');
      });

      it('should not disable buttons if there are no limits set', () => {
        expect(decreaseButton.hasAttribute('disabled')).to.be.false;
        expect(increaseButton.hasAttribute('disabled')).to.be.false;
      });

      it('should disable minus button if min limit is reached', async () => {
        numberField.value = 0;
        await nextFrame();

        numberField.min = 0;
        await nextFrame();
        expect(decreaseButton.hasAttribute('disabled')).to.be.true;
        expect(increaseButton.hasAttribute('disabled')).to.be.false;
      });

      it('should disable plus button if max limit is reached', async () => {
        numberField.value = 1;
        numberField.max = 1;
        await nextFrame();
        expect(decreaseButton.hasAttribute('disabled')).to.be.false;
        expect(increaseButton.hasAttribute('disabled')).to.be.true;
      });

      it('should not change value when the field is disabled and controls are clicked', async () => {
        numberField.disabled = true;
        numberField.value = 0;
        await nextFrame();

        increaseButton.click();
        expect(numberField.value).to.be.equal('0');

        decreaseButton.click();
        expect(numberField.value).to.be.equal('0');
      });

      it('should not change value on minus button click when min limit is reached', async () => {
        numberField.min = -1;
        await nextFrame();

        numberField.value = 0;
        await nextFrame();

        decreaseButton.click();
        expect(numberField.value).to.be.equal('-1');

        decreaseButton.click();
        expect(numberField.value).to.be.equal('-1');
      });

      it('should not change value on plus button click when max limit is reached', async () => {
        numberField.max = 1;
        await nextFrame();

        numberField.value = 0;
        await nextFrame();

        increaseButton.click();
        expect(numberField.value).to.be.equal('1');

        increaseButton.click();
        expect(numberField.value).to.be.equal('1');
      });

      it('should not change value on plus button click when max limit will be reached with the next step', async () => {
        numberField.min = -10;
        numberField.max = 10;
        numberField.step = 6;
        await nextFrame();

        numberField.value = 2;
        await nextFrame();

        increaseButton.click();
        expect(numberField.value).to.be.equal('8');

        increaseButton.click();
        expect(numberField.value).to.be.equal('8');
      });

      it('should prevent touchend event on value control buttons', async () => {
        numberField.value = 0;
        await nextFrame();

        let e = new CustomEvent('touchend', { cancelable: true });
        increaseButton.dispatchEvent(e);
        expect(e.defaultPrevented).to.be.true;
        expect(numberField.value).to.equal('1');

        e = new CustomEvent('touchend', { cancelable: true });
        decreaseButton.dispatchEvent(e);
        expect(e.defaultPrevented).to.be.true;
        expect(numberField.value).to.equal('0');
      });

      it('should decrease value to max value on minus button click when value is over max', async () => {
        numberField.value = 50;
        numberField.max = 10;
        await nextFrame();

        decreaseButton.click();

        expect(numberField.value).to.be.equal(String(numberField.max));
      });

      it('should decrease value to the closest step value on minus button click', async () => {
        numberField.min = -17;
        numberField.value = -8;
        numberField.step = 4;
        await nextFrame();

        decreaseButton.click();

        expect(numberField.value).to.be.equal('-9');
      });

      it('should correctly decrease value on minus button click', async () => {
        numberField.min = -20;
        numberField.value = -1;
        numberField.step = 4;
        await nextFrame();

        const correctSteps = [-4, -8, -12, -16, -20];
        for (let i = 0; i < correctSteps.length; i++) {
          decreaseButton.click();
          expect(numberField.value).to.be.equal(String(correctSteps[i]));
        }
      });

      it('should increase value to min value on plus button click when value is under min', async () => {
        numberField.value = -40;
        numberField.min = -10;
        await nextFrame();

        increaseButton.click();

        expect(numberField.value).to.be.equal(String(numberField.min));
      });

      it('should increase value to the closest step value on plus button click', async () => {
        numberField.min = -17;
        numberField.value = -8;
        numberField.step = 4;
        await nextFrame();

        increaseButton.click();

        expect(numberField.value).to.be.equal('-5');
      });

      it('should correctly increase value on plus button click', async () => {
        numberField.min = -3;
        numberField.max = 18;
        numberField.value = -1;
        numberField.step = 4;
        await nextFrame();

        const correctSteps = [1, 5, 9, 13, 17];
        for (let i = 0; i < correctSteps.length; i++) {
          increaseButton.click();
          expect(numberField.value).to.be.equal(String(correctSteps[i]));
        }
      });

      it('should correctly increase value on plus button click when step is a decimal number', async () => {
        numberField.min = -0.02;
        numberField.max = 0.02;
        numberField.value = -0.03;
        numberField.step = 0.01;
        await nextFrame();

        const correctSteps = [-0.02, -0.01, 0, 0.01, 0.02];
        for (let i = 0; i < correctSteps.length; i++) {
          increaseButton.click();
          expect(numberField.value).to.be.equal(String(correctSteps[i]));
        }
      });

      it('should correctly calculate the precision with decimal value', async () => {
        numberField.value = 5.1;
        numberField.step = 0.01;
        await nextFrame();

        increaseButton.click();
        expect(numberField.value).to.be.equal('5.11');
      });

      describe('problematic values', () => {
        it('should correctly increase value', () => {
          const configs = [
            { props: { step: 0.001, value: 1.001 }, expectedValue: '1.002' },
            { props: { step: 0.001, value: 1.003 }, expectedValue: '1.004' },
            { props: { step: 0.001, value: 1.005 }, expectedValue: '1.006' },
            { props: { step: 0.001, value: 2.002 }, expectedValue: '2.003' },
            { props: { step: 0.001, value: 4.004 }, expectedValue: '4.005' },
            { props: { step: 0.001, value: 8.008 }, expectedValue: '8.009' },
            { props: { step: 0.01, value: 16.08 }, expectedValue: '16.09' },
            { props: { step: 0.01, value: 73.1 }, expectedValue: '73.11' },
            { props: { step: 0.001, value: 1.0131, min: 0.0001 }, expectedValue: '1.0141' },
          ];
          const reset = { step: 1, min: undefined, max: undefined, value: '' };

          for (let i = 0; i < configs.length; i++) {
            const { props, expectedValue } = configs[i];
            Object.assign(numberField, reset, props);
            increaseButton.click();
            expect(numberField.value).to.be.equal(expectedValue);
          }
        });

        it('should correctly decrease value', () => {
          const configs = [
            { props: { step: 0.01, value: 72.9 }, expectedValue: '72.89' },
            { props: { step: 0.001, min: 0.0001, value: 1.0031 }, expectedValue: '1.0021' },
            { props: { step: 0.001, min: 0.0001, value: 1.0051 }, expectedValue: '1.0041' },
            { props: { step: 0.001, min: 0.0001, value: 1.0071 }, expectedValue: '1.0061' },
            { props: { step: 0.001, min: 0.0001, value: 1.0091 }, expectedValue: '1.0081' },
          ];
          const reset = { step: 1, min: undefined, max: undefined, value: '' };

          for (let i = 0; i < configs.length; i++) {
            const { props, expectedValue } = configs[i];
            Object.assign(numberField, reset, props);
            decreaseButton.click();
            expect(numberField.value).to.be.equal(expectedValue);
          }
        });
      });
    });

    describe('no initial value', () => {
      describe('min is defined and max is undefined', () => {
        describe('min is below zero', () => {
          it('should set value to the first positive step value when min < 0 on plus button click', async () => {
            numberField.min = -19;
            numberField.step = 6;
            await nextFrame();

            increaseButton.click();

            expect(numberField.value).to.be.equal('5');
          });

          it('should set value to the first negative step value when min < 0 zero on plus button click', async () => {
            numberField.min = -19;
            numberField.step = 6;
            await nextFrame();

            decreaseButton.click();

            expect(numberField.value).to.be.equal('-1');
          });
        });

        describe('min is above zero', () => {
          it('should set value to min when min > 0 on pus button click', async () => {
            numberField.min = 19;
            numberField.step = 6;
            await nextFrame();

            increaseButton.click();

            expect(numberField.value).to.be.equal('19');
          });

          it('should set value to min when min > 0 on minus button click', async () => {
            numberField.min = 19;
            numberField.step = 6;
            await nextFrame();

            decreaseButton.click();

            expect(numberField.value).to.be.equal('19');
          });
        });

        describe('min equals zero', () => {
          it('should set value to the first positive step value when min = 0 on plus button click', async () => {
            numberField.min = 0;
            numberField.step = 6;
            await nextFrame();

            increaseButton.click();

            expect(numberField.value).to.be.equal('6');
          });

          it('should set value to 0 when min = 0 on minus button click', async () => {
            numberField.min = 0;
            numberField.step = 6;
            await nextFrame();

            decreaseButton.click();

            expect(numberField.value).to.be.equal('0');
          });
        });
      });

      describe('max is defined and min is undefined', () => {
        describe('max is below zero', () => {
          it('should set value to the closest to the max value when max < 0 on plus button click', async () => {
            // -19 cannot be equally divided by 6
            // The closest is -24, cause with the next stepUp it will become -18
            numberField.max = -19;
            numberField.step = 6;
            await nextFrame();

            increaseButton.click();

            expect(numberField.value).to.be.equal('-24');

            // Check with max that can be equally divided
            numberField.value = '';
            numberField.max = -18;
            numberField.step = 6;
            await nextFrame();

            increaseButton.click();

            expect(numberField.value).to.be.equal('-18');
          });

          it('should set value to max when max < 0 on minus button click', async () => {
            numberField.max = -19;
            numberField.step = 6;
            await nextFrame();

            decreaseButton.click();

            expect(numberField.value).to.be.equal('-19');
          });
        });

        describe('max is above zero', () => {
          it('should set value to the first positive step value when max > 0 on minus button click', async () => {
            numberField.max = 19;
            numberField.step = 6;
            await nextFrame();

            increaseButton.click();

            expect(numberField.value).to.be.equal('6');
          });

          it('should set value to the first step negative step value when max > 0 on minus button click', async () => {
            numberField.max = 19;
            numberField.step = 6;
            await nextFrame();

            decreaseButton.click();

            expect(numberField.value).to.be.equal('-6');
          });
        });

        describe('max equals zero', () => {
          it('should set value to 0 when max = 0 on plus button click', async () => {
            numberField.max = 0;
            numberField.step = 6;
            await nextFrame();

            increaseButton.click();

            expect(numberField.value).to.be.equal('0');
          });

          it('should set value to the first negative step value when max = 0 on minus button click', async () => {
            numberField.max = 0;
            numberField.step = 6;
            await nextFrame();

            decreaseButton.click();

            expect(numberField.value).to.be.equal('-6');
          });
        });
      });

      describe('min and max values are defined', async () => {
        it('should set value to the closest to the max when min < 0 and max < 0 on plus button click', async () => {
          numberField.min = -20;
          numberField.max = -3;
          numberField.step = 6;
          await nextFrame();

          increaseButton.click();

          expect(numberField.value).to.be.equal('-8');

          // Check with max that can be equally divided
          numberField.value = '';
          numberField.min = -24;
          numberField.step = 6;
          await nextFrame();

          increaseButton.click();

          expect(numberField.value).to.be.equal('-6');
        });

        it('should set value to 0 when max = 0 and min = 0 on minus button or plus button click', async () => {
          numberField.min = 0;
          numberField.max = 0;
          numberField.step = 6;
          await nextFrame();

          decreaseButton.click();
          expect(numberField.value).to.be.equal('0');

          increaseButton.click();
          expect(numberField.value).to.be.equal('0');
        });

        it('should set value to min when min > 0 and max > 0 on plus button click', async () => {
          numberField.min = 3;
          numberField.max = 19;
          numberField.step = 6;
          await nextFrame();

          increaseButton.click();

          expect(numberField.value).to.be.equal('3');
        });

        it('should set value to min when min > 0 and max < 0 on plus button click', async () => {
          numberField.min = 19;
          numberField.max = -3;
          numberField.step = 6;
          await nextFrame();

          increaseButton.click();

          expect(numberField.value).to.be.equal('19');
        });

        it('should set value to the first positive step value when min < 0 and max is > 0 on plus button click', async () => {
          numberField.min = -19;
          numberField.max = 19;
          numberField.step = 6;
          await nextFrame();

          increaseButton.click();

          expect(numberField.value).to.be.equal('5');
        });

        it('should set value to max when min < 0 and max < 0 on minus button click', async () => {
          numberField.min = -19;
          numberField.max = -3;
          numberField.step = 6;
          await nextFrame();

          decreaseButton.click();

          expect(numberField.value).to.be.equal('-3');
        });

        it('should set value to min when min > 0 and max > 0 on minus button click', async () => {
          numberField.min = 3;
          numberField.max = 19;
          numberField.step = 6;
          await nextFrame();

          decreaseButton.click();

          expect(numberField.value).to.be.equal('3');
        });

        it('should set value to max when min > 0 and max < 0 on minus button click', async () => {
          numberField.min = 19;
          numberField.max = -3;
          numberField.step = 6;
          await nextFrame();

          decreaseButton.click();

          expect(numberField.value).to.be.equal('-3');
        });

        it('should set value to the first negative step value when min < 0 and max > 0 on minus button click', async () => {
          numberField.min = -19;
          numberField.max = 19;
          numberField.step = 6;
          await nextFrame();

          decreaseButton.click();

          expect(numberField.value).to.be.equal('-1');
        });
      });

      describe('min and max values are undefined', () => {
        it('should set value to the first positive step value on minus button click', async () => {
          numberField.step = 6;
          await nextFrame();

          increaseButton.click();

          expect(numberField.value).to.be.equal('6');
        });

        it('should set value to the first negative step value on minus button click', async () => {
          numberField.step = 6;
          await nextFrame();

          decreaseButton.click();

          expect(numberField.value).to.be.equal('-6');
        });
      });
    });

    describe('input validation', () => {
      it('should be valid with numeric values', async () => {
        expect(numberField.validate()).to.be.true;

        numberField.value = '1';
        await nextFrame();
        expect(input.value).to.be.equal('1');
        expect(numberField.validate()).to.be.true;
      });

      it('should prevent setting non-numeric values', async () => {
        numberField.value = 'foo';
        await nextFrame();
        expect(numberField.value).to.be.empty;
        expect(numberField.validate()).to.be.true;
      });

      it('should align checkValidity with the native input element', async () => {
        numberField.value = -1;
        numberField.min = 0;
        await nextFrame();
        expect(numberField.checkValidity()).to.equal(input.checkValidity());
      });

      it('should not validate when explicitly set to invalid', async () => {
        numberField.invalid = true;
        await nextFrame();

        expect(numberField.value).to.be.empty;
        expect(numberField.validate()).to.be.false;

        expect(numberField.invalid).to.be.true;
      });

      it('should allow setting decimals', async () => {
        numberField.value = 7.6;
        await nextFrame();
        expect(numberField.value).to.be.equal('7.6');
      });

      it('should not prevent invalid values applied programmatically (step)', async () => {
        numberField.step = 0.1;
        await nextFrame();

        numberField.value = 7.686;
        await nextFrame();

        expect(numberField.value).to.be.equal('7.686');
      });

      it('should not prevent invalid values applied programmatically (min)', async () => {
        numberField.min = 2;
        await nextFrame();

        numberField.value = 1;
        await nextFrame();

        expect(numberField.value).to.be.equal('1');
      });

      it('should not prevent invalid values applied programmatically (max)', async () => {
        numberField.max = 2;
        await nextFrame();

        numberField.value = 3;
        await nextFrame();

        expect(numberField.value).to.be.equal('3');
      });

      it('should validate when setting limits', async () => {
        numberField.min = 2;
        numberField.max = 4;
        await nextFrame();

        numberField.value = '';
        await nextFrame();
        expect(numberField.validate(), 'empty value is allowed because not required').to.be.true;

        numberField.value = '3';
        await nextFrame();
        expect(numberField.validate(), 'valid value should be in the range').to.be.true;

        numberField.value = '1';
        await nextFrame();
        expect(numberField.validate(), 'value should not be below min').to.be.false;

        numberField.value = '3';
        await nextFrame();
        expect(numberField.validate(), 'invalid status should be reset when setting valid value').to.be.true;

        numberField.value = '5';
        await nextFrame();
        expect(numberField.validate(), 'value should not be greater than max').to.be.false;
      });

      it('should dispatch change event after validation', async () => {
        const validateSpy = sinon.spy(numberField, 'validate');
        const changeSpy = sinon.spy();
        numberField.required = true;
        numberField.addEventListener('change', changeSpy);
        numberField.value = '123';
        input.dispatchEvent(new CustomEvent('change'));
        await nextFrame();
        expect(validateSpy.calledOnce).to.be.true;
        expect(changeSpy.calledAfter(validateSpy)).to.be.true;
      });

      describe('step values', () => {
        beforeEach(async () => {
          numberField.step = 1.5;
          await nextFrame();
        });

        [-6, -1.5, 0, 1.5, 4.5].forEach((validValue) => {
          it(`should validate valid value "${validValue}" by step when defined by user`, async () => {
            numberField.value = validValue;
            await nextFrame();
            expect(numberField.validate()).to.be.true;
          });
        });

        [-3.5, -1, 2, 2.5].forEach((invalidValue) => {
          it(`should validate invalid value "${invalidValue}" by step when defined by user`, async () => {
            numberField.value = invalidValue;
            await nextFrame();
            expect(numberField.validate()).to.be.false;
          });
        });
      });

      describe('step basis', () => {
        beforeEach(async () => {
          numberField.min = 1;
          numberField.step = 1.5;
          await nextFrame();
        });

        [1, 2.5, 4, 5.5].forEach((validValue) => {
          it(`should validate valid value "${validValue}" using min as basis`, async () => {
            numberField.value = validValue;
            await nextFrame();
            expect(numberField.validate()).to.be.true;
          });
        });

        [1.5, 3, 5].forEach((invalidValue) => {
          it(`should validate invalid value "${invalidValue}" using min as basis`, async () => {
            numberField.value = invalidValue;
            await nextFrame();
            expect(numberField.validate()).to.be.false;
          });
        });
      });

      it('should not validate by step when only min and max are set', async () => {
        numberField.min = 1;
        numberField.max = 5;
        numberField.value = 1.5; // Would be invalid by default step=1
        await nextFrame();
        expect(numberField.validate()).to.be.true;
      });

      describe('removing validation constraints', () => {
        it('should update "invalid" state when "min" is removed', async () => {
          numberField.value = '42';
          numberField.min = 50;
          await nextFrame();

          numberField.validate();
          expect(numberField.invalid).to.be.true;

          numberField.min = '';
          await nextFrame();
          expect(numberField.invalid).to.be.false;
        });

        it('should update "invalid" state when "max" is removed', async () => {
          numberField.value = '42';
          numberField.max = 20;
          await nextFrame();

          numberField.validate();
          expect(numberField.invalid).to.be.true;

          numberField.max = '';
          await nextFrame();
          expect(numberField.invalid).to.be.false;
        });

        it('should update "invalid" state when "step" is removed', async () => {
          numberField.value = '3';
          numberField.min = 0;
          numberField.step = 2;
          await nextFrame();

          numberField.validate();
          expect(numberField.invalid).to.be.true;

          numberField.step = '';
          await nextFrame();
          expect(numberField.invalid).to.be.false;
        });

        it('should not set "invalid" to false when "min" is set to 0', async () => {
          numberField.value = '-5';
          numberField.min = -1;
          await nextFrame();

          numberField.validate();
          expect(numberField.invalid).to.be.true;

          numberField.min = 0;
          await nextFrame();
          expect(numberField.invalid).to.be.true;
        });

        it('should not set "invalid" to false when "max" is set to 0', async () => {
          numberField.value = '5';
          numberField.max = 1;
          await nextFrame();

          numberField.validate();
          expect(numberField.invalid).to.be.true;

          numberField.max = 0;
          await nextFrame();
          expect(numberField.invalid).to.be.true;
        });
      });
    });
  });

  describe('step attribute', () => {
    let numberField;

    beforeEach(async () => {
      numberField = fixtureSync(`<${tag} step="1.5"></${tag}>`);
      await nextRender();
    });

    it('should validate by step when defined as attribute', async () => {
      numberField.value = 1;
      await nextFrame();
      expect(numberField.validate()).to.be.false;

      numberField.value = 1.5;
      await nextFrame();
      expect(numberField.validate()).to.be.true;
    });
  });

  describe('default step attribute', () => {
    let numberField;

    beforeEach(async () => {
      numberField = fixtureSync(`<${tag} step="1"></${tag}>`);
      await nextRender();
    });

    it('should validate by step when default value defined as attribute', async () => {
      numberField.value = 1.5;
      await nextFrame();
      expect(numberField.validate()).to.be.false;

      numberField.value = 1;
      await nextFrame();
      expect(numberField.validate()).to.be.true;
    });
  });

  describe('checkValidity', () => {
    it('should return true when called before connected to the DOM', () => {
      const numberField = document.createElement(tag);
      expect(numberField.checkValidity()).to.be.true;
    });

    it('should return false when called before connected to the DOM and invalid', () => {
      const numberField = document.createElement(tag);
      numberField.invalid = true;
      expect(numberField.checkValidity()).to.be.false;
    });
  });

  describe('invalid', () => {
    let numberField;

    beforeEach(async () => {
      numberField = fixtureSync(`<${tag} invalid></${tag}>`);
      await nextRender();
    });

    it('should not remove "invalid" state when ready', () => {
      expect(numberField.invalid).to.be.true;
    });
  });

  describe('invalid with value', () => {
    let numberField;

    beforeEach(async () => {
      numberField = fixtureSync(`<${tag} invalid value="123456"></${tag}>`);
      await nextRender();
    });

    it('should not remove "invalid" state when ready', () => {
      expect(numberField.invalid).to.be.true;
    });
  });

  describe('required', () => {
    let numberField;

    beforeEach(async () => {
      numberField = fixtureSync(`<${tag} required></${tag}>`);
      await nextRender();
    });

    it('should focus on required indicator click', () => {
      numberField.shadowRoot.querySelector('[part="required-indicator"]').click();
      expect(numberField.hasAttribute('focused')).to.be.true;
    });
  });
};

describe('NumberField + Polymer', () => {
  runTests('vaadin-number-field');
});

describe('NumberField + Lit', () => {
  const LIT_TAG = 'vaadin-lit-number-field';

  customElements.define(
    LIT_TAG,
    class extends NumberField {
      static get is() {
        return LIT_TAG;
      }
    },
  );

  runTests(LIT_TAG);
});
