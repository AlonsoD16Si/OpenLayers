import { Component } from '@angular/core';
import Map from 'ol/map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { FullScreen, defaults as defaultControls } from 'ol/control';
import LayerSwitcher from 'ol-ext/control/LayerSwitcher';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {
  map!: Map;

  ngOnInit(): void {
    this.map = new Map({
      controls: defaultControls({
        zoom: true,
        zoomOptions: {
          zoomInTipLabel:
            'Acercar', zoomOutTipLabel:
            'Alejar'
        }
      })
        .extend([new FullScreen({ tipLabel: 'Pantalla completa' })]),
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
    this.map.addControl(new LayerSwitcher());
    // this.map.addControl(new FullScreen({tipLabel: 'Pantalla completa'}));
  }
}
