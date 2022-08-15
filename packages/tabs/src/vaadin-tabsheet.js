/* eslint-disable max-classes-per-file */
/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-tab.js';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

class TabSheet extends ControllerMixin(ElementMixin(ThemableMixin(PolymerElement))) {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
        }

        :host([orientation='horizontal']) {
          flex-direction: column;
        }

        ::slotted([slot='panel']) {
          flex-basis: 100%;
        }

        :host([hidden]) {
          display: none !important;
        }

        [part='tabs-container'] {
          display: flex;
          flex-direction: column;
          align-items: baseline;
        }

        :host([orientation='horizontal']) [part='tabs-container'] {
          flex-direction: row;
        }

        [part='tabs'] {
          overflow: hidden;
        }

        [part='panel-container'] {
          overflow: auto;
        }
      </style>

      <div part="tabs-container">
        <slot name="prefix"></slot>

        <slot name="tabs"></slot>

        <slot name="suffix"></slot>
      </div>

      <div part="panel-container">
        <slot name="panel"></slot>
      </div>
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
      },

      /**
       * The index of the selected tab.
       */
      selected: {
        value: 0,
        type: Number,
      },

      __tabs: {
        type: Object,
      },

      __tabItems: {
        type: Array,
      },

      __panels: {
        type: Array,
      },
    };
  }

  constructor() {
    super();
    this.role = 'tablist';
  }

  ready() {
    super.ready();

    this._tabsController = new SlotController(this, 'tabs', null, (_host, tabs) => {
      this.__tabs = tabs;
      this.__tabItems = tabs.items;

      tabs.orientation = this.orientation;
      tabs.selected = this.selected;
      tabs.addEventListener('items-changed', () => {
        this.__tabItems = tabs.items;
      });
      tabs.addEventListener('selected-changed', () => {
        this.selected = tabs.selected;
      });
    });
    this.addController(this._tabsController);

    // TODO: Implement support for multiple nodes in slot controller
    const panelSlot = this.shadowRoot.querySelector('slot[name="panel"]');
    this.__panelsObserver = new FlattenedNodesObserver(panelSlot, () => {
      this.__panels = panelSlot.assignedNodes({ flatten: true });
    });
  }

  static get observers() {
    return [
      '__tabItemsOrPanelsChanged(__tabItems, __panels)',
      '__selectedTabItemChanged(selected, __tabItems, __panels)',
      '__orientationSelectedChanged(__tabs, orientation, selected)',
    ];
  }

  __tabItemsOrPanelsChanged(tabItems, panels) {
    if (!tabItems || !panels) {
      return;
    }

    tabItems.forEach((tabItem) => {
      const tabPanel = panels.find((panel) => panel.getAttribute('tab') === tabItem.id);

      if (tabPanel) {
        tabPanel.role = 'tabpanel';
        tabPanel.id = tabPanel.id || `${tabPanel.localName}-${generateUniqueId()}`;
        tabItem.setAttribute('aria-controls', tabPanel.id);
        tabPanel.setAttribute('aria-labelledby', tabItem.id);
      }
    });
  }

  __selectedTabItemChanged(selected, tabItems, panels) {
    if (!tabItems || !panels || selected === undefined) {
      return;
    }

    const selectedTab = tabItems[selected];
    const selectedTabId = selectedTab ? selectedTab.id : '';

    panels.forEach((panel) => {
      panel.hidden = panel.getAttribute('tab') !== selectedTabId;
    });
  }

  __orientationSelectedChanged(tabs, orientation, selected) {
    if (tabs) {
      tabs.orientation = orientation;
      tabs.selected = selected;
    }

    if (orientation) {
      this.setAttribute('aria-orientation', orientation);
    } else {
      this.removeAttribute('aria-orientation');
    }
  }
}

customElements.define(TabSheet.is, TabSheet);

export { TabSheet };
