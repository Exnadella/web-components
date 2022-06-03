/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * @polymerMixin
 */
export const ProgressMixin = (superClass) =>
  class ProgressMixinClass extends superClass {
    static get styles() {
      return css`
        :host {
          display: block;
          width: 100%; /* prevent collapsing inside non-stretching column flex */
          height: 8px;
        }

        :host([hidden]) {
          display: none !important;
        }

        [part='bar'] {
          height: 100%;
        }

        [part='value'] {
          height: 100%;
          transform-origin: 0 50%;
          transform: scaleX(var(--vaadin-progress-value));
        }

        :host([dir='rtl']) [part='value'] {
          transform-origin: 100% 50%;
        }
      `;
    }

    static get properties() {
      return {
        /**
         * Current progress value.
         */
        value: {
          type: Number,
          observer: '_valueChanged',
        },

        /**
         * Minimum bound of the progress bar.
         * @type {number}
         */
        min: {
          type: Number,
          value: 0,
          observer: '_minChanged',
        },

        /**
         * Maximum bound of the progress bar.
         * @type {number}
         */
        max: {
          type: Number,
          value: 1,
          observer: '_maxChanged',
        },

        /**
         * Indeterminate state of the progress bar.
         * This property takes precedence over other state properties (min, max, value).
         * @type {boolean}
         */
        indeterminate: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
        },
      };
    }

    static get observers() {
      return ['_normalizedValueChanged(value, min, max)'];
    }

    /** @protected */
    ready() {
      super.ready();

      this.setAttribute('role', 'progressbar');
    }

    /** @private */
    _normalizedValueChanged(value, min, max) {
      const newNormalizedValue = this._normalizeValue(value, min, max);

      this.style.setProperty('--vaadin-progress-value', newNormalizedValue);
    }

    /** @private */
    _valueChanged(newV) {
      this.setAttribute('aria-valuenow', newV);
    }

    /** @private */
    _minChanged(newV) {
      this.setAttribute('aria-valuemin', newV);
    }

    /** @private */
    _maxChanged(newV) {
      this.setAttribute('aria-valuemax', newV);
    }

    /**
     * Percent of current progress relative to whole progress bar (max - min)
     * @private
     */
    _normalizeValue(value, min, max) {
      let nV;

      if (!value && value !== 0) {
        nV = 0;
      } else if (min >= max) {
        nV = 1;
      } else {
        nV = (value - min) / (max - min);

        nV = Math.min(Math.max(nV, 0), 1);
      }

      return nV;
    }
  };
