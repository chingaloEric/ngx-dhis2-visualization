import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { tap } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';

// reducers
import { VisualizationState } from '../reducers';

// actions
import {
  LoadVisualizationAnalyticsAction,
  LoadVisualizationAnalyticsSuccessAction,
  VisualizationLayerActionTypes,
  UpdateVisualizationObjectAction
} from '../actions';

// services
import { AnalyticsService } from '../../services';

// helpers
import {
  getStandardizedAnalyticsObject,
  getSanitizedAnalytics
} from '../../helpers';

@Injectable()
export class VisualizationLayerEffects {
  constructor(
    private actions$: Actions,
    private store: Store<VisualizationState>,
    private analyticsService: AnalyticsService
  ) {}

  @Effect({ dispatch: false })
  loadAnalytics$: Observable<any> = this.actions$
    .ofType(VisualizationLayerActionTypes.LOAD_VISUALIZATION_ANALYTICS)
    .pipe(
      tap((action: LoadVisualizationAnalyticsAction) => {
        forkJoin(
          _.map(action.visualizationLayers, visualizationLayer =>
            this.analyticsService.getAnalytics(
              visualizationLayer.dataSelections,
              visualizationLayer.layerType,
              visualizationLayer.config
            )
          )
        ).subscribe(
          analyticsResponse => {
            // Save visualizations layers
            _.each(analyticsResponse, (analytics, analyticsIndex) => {
              this.store.dispatch(
                new LoadVisualizationAnalyticsSuccessAction(
                  action.visualizationLayers[analyticsIndex].id,
                  {
                    analytics: getSanitizedAnalytics(
                      getStandardizedAnalyticsObject(analytics, true),
                      action.visualizationLayers[analyticsIndex].dataSelections
                    )
                  }
                )
              );
            });
            // Update visualization object
            this.store.dispatch(
              new UpdateVisualizationObjectAction(action.visualizationId, {
                progress: {
                  statusCode: 200,
                  statusText: 'OK',
                  percent: 100,
                  message: 'Analytics loaded'
                }
              })
            );
          },
          error => {
            this.store.dispatch(
              new UpdateVisualizationObjectAction(action.visualizationId, {
                progress: {
                  statusCode: error.status,
                  statusText: 'Error',
                  percent: 100,
                  message: error.error
                }
              })
            );
          }
        );
      })
    );
}
