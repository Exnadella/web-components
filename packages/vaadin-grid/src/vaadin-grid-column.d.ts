/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { GridDefaultItem } from '@datadobi/grid/src/vaadin-grid.js';
import { GridColumn } from '@datadobi/grid/src/vaadin-grid-column.js';

/**
 * @deprecated Import `GridColumn` from `@datadobi/grid/vaadin-grid-column` instead.
 */
export type GridColumnElement<TItem = GridDefaultItem> = GridColumn<TItem>;

/**
 * @deprecated Import `GridColumn` from `@datadobi/grid/vaadin-grid-column` instead.
 */
export const GridColumnElement: typeof GridColumn;

export * from '@datadobi/grid/src/vaadin-grid-column.js';
