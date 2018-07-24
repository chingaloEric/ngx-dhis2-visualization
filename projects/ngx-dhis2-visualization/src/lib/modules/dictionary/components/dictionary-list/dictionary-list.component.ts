import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { MetadataDictionary } from '../../models/dictionary';

import { DictionaryState } from '../../store/reducers/dictionary.reducer';
import { getDictionaryList } from '../../store/selectors/dictionary.selectors';
import { InitializeDictionaryMetadataAction } from '../../store/actions/dictionary.actions';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dictionary-list',
  templateUrl: './dictionary-list.component.html',
  styleUrls: ['./dictionary-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DictionaryListComponent implements OnInit {
  @Input() visualizationLayers: any[];
  dictionaryList$: Observable<MetadataDictionary[]>;
  activeItem: number;

  constructor(private store: Store<DictionaryState>) {
    this.activeItem = 0;
  }

  ngOnInit() {
    if (this.visualizationLayers.length > 0) {
      const metadataIdentifiers = _.uniq(
        _.flatten(
          _.map(this.visualizationLayers, layer => layer.metadataIdentifiers)
        )
      );

      this.store.dispatch(
        new InitializeDictionaryMetadataAction(metadataIdentifiers)
      );

      this.dictionaryList$ = this.store.select(
        getDictionaryList(metadataIdentifiers)
      );
    }
  }

  setActiveItem(index, e) {
    e.stopPropagation();
    if (this.activeItem === index) {
      this.activeItem = -1;
    } else {
      this.activeItem = index;
    }
  }
}
