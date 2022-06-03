/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { LitElement } from 'lit';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { TextAreaMixin } from './vaadin-text-area-mixin.js';

/**
 * LitElement based version of `<vaadin-text-area>` web component.
 * Note: this is a prototype not supposed to be used publicly.
 */
declare class TextArea extends TextAreaMixin(ThemableMixin(ElementMixin(PolylitMixin(LitElement)))) {}

export { TextArea };
