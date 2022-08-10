/* eslint-disable max-classes-per-file */
/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-tab.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { Scroller } from '@vaadin/scroller';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { Tabs } from './vaadin-tabs.js';

class TabSheetTabs extends Tabs {
  static get is() {
    return 'vaadin-tabsheet-tabs';
  }
}

customElements.define(TabSheetTabs.is, TabSheetTabs);

class TabSheetScroller extends Scroller {
  static get is() {
    return 'vaadin-tabsheet-scroller';
  }
}

customElements.define(TabSheetScroller.is, TabSheetScroller);

class TabSheetPanel extends PolymerElement {
  static get is() {
    return 'vaadin-tabsheet-panel';
  }
}

customElements.define(TabSheetPanel.is, TabSheetPanel);

class TabSheet extends ElementMixin(ThemableMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
        }

        :host([orientation='horizontal']) {
          flex-direction: column;
        }

        ::slotted(vaadin-tabsheet-panel) {
          flex-basis: 100%;
        }

        :host([hidden]) {
          display: none !important;
        }

        [part='tabs-container'] {
          display: flex;
          align-items: baseline;
        }

        :host([orientation='vertical']) [part='tabs-container'] {
          flex-direction: column;
        }

        [part='tabs'] {
          overflow: hidden;
        }
      </style>

      <div part="tabs-container">
        <slot name="prefix"></slot>

        <vaadin-tabsheet-tabs
          part="tabs"
          orientation="[[orientation]]"
          selected="{{selected}}"
          items="{{__items}}"
          selected="{{selected}}"
        >
          <slot></slot>
        </vaadin-tabsheet-tabs>

        <slot name="suffix"></slot>
      </div>

      <vaadin-tabsheet-scroller>
        <slot name="panel"></slot>
      </vaadin-tabsheet-scroller>
    `;
  }

  static get is() {
    return 'vaadin-tabsheet';
  }

  static get properties() {
    return {
      /**
       * Set tabs disposition. Possible values are `horizontal|vertical`
       * @type {!TabsOrientation}
       */
      orientation: {
        reflectToAttribute: true,
        value: 'horizontal',
        type: String,
        observer: '__orientationChanged',
      },

      /**
       * The index of the selected tab.
       */
      selected: {
        value: 0,
        type: Number,
      },

      __items: {
        type: Array,
      },
    };
  }

  constructor() {
    super();
    this.role = 'tablist';
  }

  static get observers() {
    return ['__tabsItemsChanged(__items, selected)'];
  }

  __tabsItemsChanged(items, selected) {
    if (!items || selected === undefined) {
      return;
    }

    items.forEach((tab, index) => {
      if (tab.nextElementSibling instanceof TabSheetPanel) {
        const panel = tab.nextElementSibling;
        panel.hidden = index !== selected;
        panel.role = 'tabpanel';
        panel.id = panel.id || `${panel.localName}-${generateUniqueId()}`;

        tab.setAttribute('aria-controls', panel.id);
      }
    });
  }

  __orientationChanged(orientation) {
    if (orientation) {
      this.setAttribute('aria-orientation', orientation);
    } else {
      this.removeAttribute('aria-orientation');
    }
  }
}

customElements.define(TabSheet.is, TabSheet);

export { TabSheet };
