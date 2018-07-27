import { DataGridService } from '../data-grid.service';

export interface ElementColumnConfiguration {
  // True iff elements not in the user config should not be able to be toggled on
  allowBlankDataColumns;

  // Optional function for changing header menu items
  getMenuItems?: (params: any)  => any;

  // Sets up the nested headers needed for this element
  createElementHeader(workingNode: any, columnID: string);

  // Transforms given element data into format suitable for the grid
  createElementData(element, columndID?: string): object;

  getIdentityHeaders();

  getContextMenuItems(gridService: DataGridService);

  // TODO: Get rid of gridService here once the chart select UI changes
  getMainMenuItems(gridService: DataGridService);
}
