/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { ActiveMixinClass } from '@vaadin/component-base/src/active-mixin.js';
import { DisabledMixinClass } from '@vaadin/component-base/src/disabled-mixin.js';
import { FocusMixinClass } from '@vaadin/component-base/src/focus-mixin.js';
import { KeyboardMixinClass } from '@vaadin/component-base/src/keyboard-mixin.js';
import { CheckedMixinClass } from '@vaadin/field-base/src/checked-mixin.js';
import { DelegateFocusMixinClass } from '@vaadin/field-base/src/delegate-focus-mixin.js';
import { DelegateStateMixinClass } from '@vaadin/field-base/src/delegate-state-mixin.js';
import { InputMixinClass } from '@vaadin/field-base/src/input-mixin.js';
import { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';

/**
 * A mixin providing common checkbox functionality.
 */
export declare function CheckboxMixin<T extends Constructor<HTMLElement>>(
  base: T,
): T &
  Constructor<ActiveMixinClass> &
  Constructor<DelegateFocusMixinClass> &
  Constructor<DelegateStateMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<CheckedMixinClass> &
  Constructor<CheckboxMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<KeyboardMixinClass> &
  Constructor<InputMixinClass> &
  Constructor<LabelMixinClass>;

export declare class CheckboxMixinClass {
  /**
   * True if the checkbox is in the indeterminate state which means
   * it is not possible to say whether it is checked or unchecked.
   * The state is reset once the user switches the checkbox by hand.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Indeterminate_state_checkboxes
   */
  indeterminate: boolean;

  /**
   * The name of the checkbox.
   */
  name: string;
}
