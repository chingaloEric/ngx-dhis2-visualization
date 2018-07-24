import { Component, Input } from '@angular/core';
import * as _ from 'lodash';
import { VisualizationConfig } from '../../models/visualization-config.model';
import { VisualizationUiConfig } from '../../models/visualization-ui-config.model';
import { VisualizationLayer } from '../../models/visualization-layer.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'visualization-body-section',
  templateUrl: 'visualization-body-section.html',
  styleUrls: ['./visualization-body-section.css']
})
export class VisualizationBodySectionComponent {
  @Input() id: string;
  @Input() visualizationLayers: VisualizationLayer[];
  @Input() visualizationConfig: VisualizationConfig;
  @Input() visualizationUiConfig: VisualizationUiConfig;

  get metadataIdentifiers() {
    return _.uniq(
      _.flatten(
        _.map(this.visualizationLayers, layer => layer.metadataIdentifiers)
      )
    );
  }
  constructor() {}
}
