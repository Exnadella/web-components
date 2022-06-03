/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ItemMixin } from './vaadin-item-mixin.js';

/**
 * LitElement based version of `<vaadin-item>` web component.
 * Note: this is a prototype not supposed to be used publicly.
 *
 * @private
 */
class Item extends ItemMixin(DirMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  /** @protected */
  render() {
    return html`
      <span part="checkmark" aria-hidden="true"></span>
      <div part="content">
        <slot></slot>
      </div>
    `;
  }
}

export { Item };
