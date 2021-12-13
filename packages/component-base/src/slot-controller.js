/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';

/**
 * A controller for providing content to slot element and observing changes.
 */
export class SlotController {
  constructor(host, slotName, slotFactory, slotInitializer) {
    this.host = host;
    this.slotName = slotName;
    this.slotFactory = slotFactory;
    this.slotInitializer = slotInitializer;
  }

  hostConnected() {
    if (!this.initialized) {
      const { host, slotName, slotFactory, slotInitializer } = this;

      const slotted = this.getSlotChild();
      const isCustom = !!slotted;

      if (isCustom) {
        this.node = slotted;
      } else if (slotFactory) {
        // Slot factory is optional, some slots don't have default content.

        const slotContent = slotFactory(host);
        if (slotContent instanceof Element) {
          if (slotName !== '') {
            slotContent.setAttribute('slot', slotName);
          }
          host.appendChild(slotContent);
          this.node = slotContent;

          // Store reference to not pass default node to `initCustomNode`.
          this.defaultNode = slotContent;
        }
      }

      // Don't try to bind `this` to initializer (normally it's arrow function).
      // Instead, pass the host as a first argument to access component's state.
      if (slotInitializer) {
        slotInitializer(host, this.node, isCustom);
      }

      // TODO: Consider making this behavior opt-in to improve performance.
      this.observe();

      this.initialized = true;
    }
  }

  /**
   * Return a reference to the node managed by the controller.
   * @return {Node}
   */
  getSlotChild() {
    const { slotName } = this;
    return Array.from(this.host.childNodes).find((node) => {
      // Either an element (any slot) or a text node (only un-named slot).
      return (
        (node.nodeType === Node.ELEMENT_NODE && node.slot === slotName) ||
        (node.nodeType === Node.TEXT_NODE && node.textContent.trim() && slotName === '')
      );
    });
  }

  /**
   * Override to initialize the newly added custom node.
   *
   * @param {Node} _node
   * @protected
   */
  initCustomNode(_node) {}

  /**
   * Override to teardown slotted node when it's removed.
   *
   * @param {Node} _node
   * @protected
   */
  teardownNode(_node) {}

  /**
   * Setup the observer to manage slot content changes.
   * @protected
   */
  observe() {
    const { slotName } = this;
    const selector = slotName === '' ? 'slot:not([name])' : `slot[name=${slotName}]`;
    const slot = this.host.shadowRoot.querySelector(selector);

    this.__slotObserver = new FlattenedNodesObserver(slot, (info) => {
      const current = this.node;

      const newNode = info.addedNodes.find((node) => node !== current);
      const oldNode = info.removedNodes.find((node) => node === current);

      if (newNode) {
        // Custom node is added, remove the previous one.
        if (current && current.isConnected) {
          this.host.removeChild(current);
        }

        this.node = newNode;

        if (newNode !== this.defaultNode) {
          this.initCustomNode(newNode);
        }
      }

      // Invoke teardown for old node after the new one is added.
      // This way we can check whether to restore generated node.
      if (oldNode) {
        this.teardownNode(oldNode);
      }
    });
  }
}
