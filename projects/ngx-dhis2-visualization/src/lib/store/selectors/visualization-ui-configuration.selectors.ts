import {
  getVisualizationObjectEntities,
  getVisualizationUiConfigurationEntities
} from '../reducers';
import { createSelector, MemoizedSelector } from '@ngrx/store';
import { Visualization, VisualizationUiConfig } from '../../models';
export const getCurrentVisualizationUiConfig = (visualizationId: string) =>
  createSelector(
    getVisualizationObjectEntities,
    getVisualizationUiConfigurationEntities,
    (visualizationObjectEntities, visualizationUiConfigurationEntities) => {
      const currentVisualizationObject: Visualization =
        visualizationObjectEntities[visualizationId];
      if (!currentVisualizationObject) {
        return null;
      }

      return visualizationUiConfigurationEntities[
        currentVisualizationObject.uiConfigId
      ];
    }
  );
