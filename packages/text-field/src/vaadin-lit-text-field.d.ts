/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { LitElement } from 'lit';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { TextFieldMixin } from './vaadin-text-field-mixin.js';

/**
 * LitElement based version of `<vaadin-text-field>` web component.
 * Note: this is a prototype not supposed to be used publicly.
 */
declare class TextField extends TextFieldMixin(ThemableMixin(ElementMixin(PolylitMixin(LitElement)))) {}

export { TextField };
