/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '../color.js';

const requiredField = css`
  [part='label'] {
    display: block;
    position: absolute;
    top: 8px;
    font-size: 1em;
    line-height: 1;
    height: 20px;
    margin-bottom: -4px;
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
    color: var(--material-secondary-text-color);
    transform-origin: 0 75%;
    transform: scale(0.75);
  }

  :host([required]) [part='required-indicator']::after {
    content: ' *';
    color: inherit;
  }

  :host([invalid]) [part='label'] {
    color: var(--material-error-text-color);
  }

  :host([label-position='aside']) [part='label'] {
    white-space: normal;
    position: static;
    transform: none;
    margin-bottom: 0;
    height: auto;
    padding-top: calc(16px - 0.5em);
    font-size: var(--material-small-font-size);
    pointer-events: auto;
  }

  [part='error-message'] {
    font-size: 0.75em;
    line-height: 1;
    color: var(--material-error-text-color);
  }

  :host([has-error-message]) [part='error-message']::before {
    content: '';
    display: block;
    height: 6px;
  }

  :host(:not([invalid])) [part='error-message'] {
    margin-top: 0;
    max-height: 0;
    overflow: hidden;
  }

  :host([invalid]) [part='error-message'] {
    animation: reveal 0.2s;
  }

  @keyframes reveal {
    0% {
      opacity: 0;
    }
  }

  /* RTL specific styles */
  :host([dir='rtl']) [part='label'] {
    transform-origin: 100% 75%;
  }
`;

registerStyles('', requiredField, { moduleId: 'material-required-field' });

export { requiredField };
