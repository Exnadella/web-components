/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { CheckboxMixin } from './vaadin-checkbox-mixin.js';

/**
 * LitElement based version of `<vaadin-checkbox>` web component.
 * Note: this is a prototype not supposed to be used publicly.
 *
 * @private
 */
class Checkbox extends CheckboxMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  /** @protected */
  render() {
    return html`
      <div class="vaadin-checkbox-container">
        <div class="vaadin-checkbox-wrapper">
          <div part="checkbox"></div>
          <slot name="input"></slot>
        </div>

        <slot name="label"></slot>
      </div>
    `;
  }
}

export { Checkbox };
