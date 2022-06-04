/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { TextField } from '@vaadin/text-field/src/vaadin-lit-text-field.js';

/**
 * LitElement based version of `<vaadin-email-field>` web component.
 * Note: this is a prototype not supposed to be used publicly.
 */
class EmailField extends TextField {
  constructor() {
    super();
    this._setType('email');
  }

  /** @protected */
  ready() {
    super.ready();

    if (this.inputElement) {
      this.inputElement.autocapitalize = 'off';
    }
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

    if (!this.pattern) {
      this.pattern = '^([a-zA-Z0-9_\\.\\-+])+@[a-zA-Z0-9-.]+\\.[a-zA-Z0-9-]{2,}$';

      // Pattern needs to be set before constraints observer is initialized
      // Setting it triggers another update, wait until it is completed.
      await this.updateComplete;
    }

    super._createConstraintsObserver();
  }
}

export { EmailField };
