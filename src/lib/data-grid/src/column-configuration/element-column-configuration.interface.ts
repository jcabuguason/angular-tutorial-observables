import { DataGridService } from '../data-grid.service';

export interface ElementColumnConfiguration {

  // Optional function for changing header menu items
  getMenuItems?: (params: any)  => any;

  // Sets up the nested headers needed for this element
  createElementHeader(workingNode: any, columnID: string);

  // Transforms given element data into format suitable for the grid
  createElementData(element, columndID?: string);

  getIdentityHeaders();

  getContextMenuItems();

  getMainMenuItems(gridService: DataGridService);
}
