/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { InputController } from '@vaadin/field-base/src/input-controller.js';
import { InputFieldMixin } from '@vaadin/field-base/src/input-field-mixin.js';
import { LabelledInputController } from '@vaadin/field-base/src/labelled-input-controller.js';
import { SlotStylesMixin } from '@vaadin/field-base/src/slot-styles-mixin.js';
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * A mixin providing common number field functionality.
 *
 * @polymerMixin
 * @mixes InputFieldMixin
 * @mixes SlotStylesMixin
 */
export const NumberFieldMixin = (superClass) =>
  class NumberFieldMixinClass extends InputFieldMixin(SlotStylesMixin(superClass)) {
    static get styles() {
      return css`
        :host([readonly]) [part$='button'] {
          pointer-events: none;
        }

        [part='decrease-button']::before {
          content: '−';
        }

        [part='increase-button']::before {
          content: '+';
        }

        [part='decrease-button'],
        [part='increase-button'] {
          -webkit-user-select: none;
          -moz-user-select: none;
          user-select: none;
        }

        :host([dir='rtl']) [part='input-field'] {
          direction: ltr;
        }
      `;
    }

    static get properties() {
      return {
        /**
         * Set to true to display value increase/decrease controls.
         * @attr {boolean} has-controls
         */
        hasControls: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
        },

        /**
         * The minimum value of the field.
         */
        min: {
          type: Number,
          observer: '_minChanged',
        },

        /**
         * The maximum value of the field.
         */
        max: {
          type: Number,
          observer: '_maxChanged',
        },

        /**
         * Specifies the allowed number intervals of the field.
         * @type {number}
         */
        step: {
          type: Number,
          value: 1,
          observer: '_stepChanged',
        },
      };
    }

    static get constraints() {
      return [...super.constraints, 'min', 'max', 'step'];
    }

    constructor() {
      super();
      this._setType('number');
    }

    /** @protected */
    get slotStyles() {
      const tag = this.localName;
      return [
        `
          ${tag} input[type="number"]::-webkit-outer-spin-button,
          ${tag} input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          ${tag} input[type="number"] {
            -moz-appearance: textfield;
          }

          ${tag}[dir='rtl'] input[type="number"]::placeholder {
            direction: rtl;
          }

          ${tag}[dir='rtl']:not([has-controls]) input[type="number"]::placeholder {
            text-align: left;
          }
        `,
      ];
    }

    /**
     * Used by `InputControlMixin` as a reference to the clear button element.
     * @protected
     */
    get clearElement() {
      return this.$.clearButton;
    }

    /** @protected */
    ready() {
      super.ready();

      this.addController(
        new InputController(this, (input) => {
          this._setInputElement(input);
          this._setFocusElement(input);
          this.stateTarget = input;
          this.ariaTarget = input;
        }),
      );

      this.inputElement.min = this.min;
      this.inputElement.max = this.max;
      this.__applyStep(this.step);

      this.addController(new LabelledInputController(this.inputElement, this._labelController));
    }

    /** @protected */
    _decreaseButtonTouchend(e) {
      // Cancel the following click and focus events
      e.preventDefault();
      this._decreaseValue();
    }

    /** @protected */
    _increaseButtonTouchend(e) {
      // Cancel the following click and focus events
      e.preventDefault();
      this._increaseValue();
    }

    /**
     * @protected
     * @override
     */
    _constraintsChanged(required, min, max, _step) {
      if (!this.invalid) {
        return;
      }

      const isNumUnset = (n) => !n && n !== 0;
      if (!isNumUnset(min) || !isNumUnset(max)) {
        this.validate();
      } else if (!required) {
        this.invalid = false;
      }
    }

    /** @private */
    _decreaseValue() {
      this._incrementValue(-1);
    }

    /** @private */
    _increaseValue() {
      this._incrementValue(1);
    }

    /** @private */
    _incrementValue(incr) {
      if (this.disabled || this.readonly) {
        return;
      }

      let value = parseFloat(this.value);

      if (!this.value) {
        if ((this.min === 0 && incr < 0) || (this.max === 0 && incr > 0) || (this.max === 0 && this.min === 0)) {
          incr = 0;
          value = 0;
        } else if ((this.max == null || this.max >= 0) && (this.min == null || this.min <= 0)) {
          value = 0;
        } else if (this.min > 0) {
          value = this.min;
          if (this.max < 0 && incr < 0) {
            value = this.max;
          }
          incr = 0;
        } else if (this.max < 0) {
          value = this.max;
          if (incr < 0) {
            incr = 0;
          } else if (this._getIncrement(1, value - this.step) > this.max) {
            value -= 2 * this.step;
            // FIXME(yuriy): find a proper solution to make correct step back
          } else {
            value -= this.step;
          }
        }
      } else if (value < this.min) {
        incr = 0;
        value = this.min;
      } else if (value > this.max) {
        incr = 0;
        value = this.max;
      }

      const newValue = this._getIncrement(incr, value);
      if (!this.value || incr === 0 || this._incrementIsInsideTheLimits(incr, value)) {
        this._setValue(newValue);
      }
    }

    /** @private */
    _setValue(value) {
      this.value = this.inputElement.value = String(parseFloat(value));
      this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
    }

    /** @private */
    _getIncrement(incr, currentValue) {
      let step = this.step || 1,
        min = this.min || 0;

      // To avoid problems with decimal math, multiplying to operate with integers.
      const multiplier = Math.max(
        this._getMultiplier(currentValue),
        this._getMultiplier(step),
        this._getMultiplier(min),
      );

      step *= multiplier;
      currentValue = Math.round(currentValue * multiplier);
      min *= multiplier;

      const margin = (currentValue - min) % step;

      if (incr > 0) {
        return (currentValue - margin + step) / multiplier;
      } else if (incr < 0) {
        return (currentValue - (margin || step)) / multiplier;
      }
      return currentValue / multiplier;
    }

    /** @private */
    _getDecimalCount(number) {
      const s = String(number);
      const i = s.indexOf('.');
      return i === -1 ? 1 : s.length - i - 1;
    }

    /** @private */
    _getMultiplier(number) {
      if (!isNaN(number)) {
        return 10 ** this._getDecimalCount(number);
      }
    }

    /** @private */
    _incrementIsInsideTheLimits(incr, value) {
      if (incr < 0) {
        return this.min == null || this._getIncrement(incr, value) >= this.min;
      } else if (incr > 0) {
        return this.max == null || this._getIncrement(incr, value) <= this.max;
      }
      return this._getIncrement(incr, value) <= this.max && this._getIncrement(incr, value) >= this.min;
    }

    /** @protected */
    _allowed(sign) {
      const incr = sign * (this.step || 1);
      const value = parseFloat(this.value);
      return !this.value || (!this.disabled && this._incrementIsInsideTheLimits(incr, value));
    }

    /** @private */
    __applyStep(step) {
      if (this.inputElement) {
        this.inputElement.step = this.__validateByStep ? step : 'any';
      }
    }

    /**
     * @param {number} newVal
     * @param {number | undefined} oldVal
     * @protected
     */
    _stepChanged(newVal) {
      // TODO: refactor to not have initial value
      // https://github.com/vaadin/vaadin-text-field/issues/435

      // Avoid using initial value in validation
      this.__validateByStep = this.__stepChangedCalled || this.getAttribute('step') !== null;

      this.__applyStep(newVal);

      this.__stepChangedCalled = true;
      this.setAttribute('step', newVal);
    }

    /** @private */
    _minChanged(min) {
      if (this.inputElement) {
        this.inputElement.min = min;
      }
    }

    /** @private */
    _maxChanged(max) {
      if (this.inputElement) {
        this.inputElement.max = max;
      }
    }

    /**
     * @param {unknown} newVal
     * @param {unknown} oldVal
     * @protected
     * @override
     */
    _valueChanged(newVal, oldVal) {
      // Validate value to be numeric
      if (newVal && isNaN(parseFloat(newVal))) {
        this.value = '';
      } else if (typeof this.value !== 'string') {
        this.value = String(this.value);
      }

      super._valueChanged(this.value, oldVal);
    }

    /**
     * Override an event listener from `KeyboardMixin`.
     *
     * @param {!KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(event) {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        this._increaseValue();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        this._decreaseValue();
      }

      super._onKeyDown(event);
    }

    /**
     * Returns true if the current input value satisfies all constraints (if any).
     * @return {boolean}
     */
    checkValidity() {
      if (
        this.inputElement &&
        (this.required || this.min !== undefined || this.max !== undefined || this.__validateByStep)
      ) {
        return this.inputElement.checkValidity();
      }
      return !this.invalid;
    }
  };
