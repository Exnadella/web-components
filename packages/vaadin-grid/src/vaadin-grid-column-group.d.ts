/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { GridDefaultItem } from '@datadobi/grid/src/vaadin-grid.js';
import { GridColumnGroup } from '@datadobi/grid/src/vaadin-grid-column-group.js';

/**
 * @deprecated Import `GridColumnGroup` from `@datadobi/grid/vaadin-grid-column-group` instead.
 */
export type GridColumnGroupElement<TItem = GridDefaultItem> = GridColumnGroup<TItem>;

/**
 * @deprecated Import `GridColumnGroup` from `@datadobi/grid/vaadin-grid-column-group` instead.
 */
export const GridColumnGroupElement: typeof GridColumnGroup;

export * from '@datadobi/grid/src/vaadin-grid-column-group.js';
