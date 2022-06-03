/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/input-container/src/vaadin-input-container.js';
import { html, LitElement } from 'lit';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { NumberFieldMixin } from './vaadin-number-field-mixin.js';

/**
 * LitElement based version of `<vaadin-number-field>` web component.
 * Note: this is a prototype not supposed to be used publicly.
 */
class NumberField extends NumberFieldMixin(ThemableMixin(ElementMixin(PolylitMixin(LitElement)))) {
  render() {
    return html`
      <div class="vaadin-field-container">
        <div part="label">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true" @click="${this.focus}"></span>
        </div>

        <vaadin-input-container
          part="input-field"
          .readonly="${this.readonly}"
          .disabled="${this.disabled}"
          .invalid="${this.invalid}"
          theme="${this._theme}"
        >
          <div
            part="decrease-button"
            ?disabled="${!this._allowed(-1, this.value, this.min, this.max, this.step)}"
            ?hidden="${!this.hasControls}"
            @click="${this._decreaseValue}"
            @touchend="${this._decreaseButtonTouchend}"
            aria-hidden="true"
            slot="prefix"
          ></div>
          <slot name="prefix" slot="prefix"></slot>
          <slot name="input"></slot>
          <slot name="suffix" slot="suffix"></slot>
          <div id="clearButton" part="clear-button" slot="suffix" aria-hidden="true"></div>
          <div
            part="increase-button"
            ?disabled="${!this._allowed(1, this.value, this.min, this.max, this.step)}"
            ?hidden="${!this.hasControls}"
            @click="${this._increaseValue}"
            @touchend="${this._increaseButtonTouchend}"
            aria-hidden="true"
            slot="suffix"
          ></div>
        </vaadin-input-container>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>
    `;
  }

  /**
   * Override method from `InputConstraintsMixin`
   * to create observer after the initial update
   * and preserve invalid state set as attribute.
   *
   * @protected
   * @override
   */
  async _createConstraintsObserver() {
    await this.updateComplete;

    super._createConstraintsObserver();
  }
}

export { NumberField };
