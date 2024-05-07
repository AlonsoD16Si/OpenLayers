import { Component, EventEmitter, Output } from '@angular/core';
import Map from 'ol/map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { FullScreen, defaults as defaultControls } from 'ol/control';

import LayerSwitcher from 'ol-ext/control/LayerSwitcher';
import LayerGroup from 'ol/layer/Group.js';
import XYZ from 'ol/source/XYZ.js';

import Bar from 'ol-ext/control/Bar';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import Toggle from 'ol-ext/control/Toggle';
import Draw from 'ol/interaction/Draw.js';

import WKT from 'ol/format/WKT.js';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {
  map!: Map;
  public wkt!: string;

  @Output()
  enviar: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit(): void {
    let self = this;
    let lg_capas_base = new LayerGroup({
      properties: { title: 'Capas Base', openInLayerSwitcher: true },
      layers: [
        new TileLayer({
          source: new OSM(),
          properties: { title: 'OSM', baseLayer: true }
        }),
        new TileLayer({
          source: new XYZ({
            url: 'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}'
          }),
          properties: { title: 'Google Maps', baseLayer: true },
          visible: false
        })
      ]
    })
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
        lg_capas_base

      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });

    // console.log(this.map.getView().getProjection());//Sistema de coordenadas que maneja OpenLayer
    this.map.addControl(new LayerSwitcher());
    //manejo de vectores
    let vectorLayer = new VectorLayer({
      source: new VectorSource(),//almacenar datos
      properties: { displayInLayerSwitcher: false }
    })
    this.map.addLayer(vectorLayer);
    //barras de controles
    let mainBar = new Bar({});
    this.map.addControl(mainBar);

    let dibujoBar = new Bar({
      group: true,
      toggleOne: true
    });
    mainBar.addControl(dibujoBar);

    //botones que se activan y se desactivan
    var draw_p = new Draw({//variable de interaccion
      type: 'Point',
      source: vectorLayer.getSource() as VectorSource
    })
    let tg_punto = new Toggle({
      title: 'Dibujar punto',
      html: '<i class="fa-solid fa-location-dot"></i>',
      interaction: draw_p
    })

    //Disparador drawend
    draw_p.on('drawend', function (e) {
      console.log('...', e);

      let format = new WKT();
      let wkt = format.writeFeature(e.feature, { featureProjection: "EPSG:3857", dataProjection: "EPSG:4326" });
      console.log(wkt);
      self.enviar.emit(wkt);
    });


    dibujoBar.addControl(tg_punto);
    //Linea

    let draw_l = new Draw({
      type: 'LineString',
      source: vectorLayer.getSource() as VectorSource
    });
    let tg_linea = new Toggle({
      title: 'Dibujar linea',
      html: '<i class="fa-solid fa-share-nodes"></i>',
      interaction: draw_l
    });
    draw_l.on('drawend', function (e) {

      let format = new WKT();
      let wkt = format.writeFeature(e.feature, { featureProjection: "EPSG:3857", dataProjection: "EPSG:4326" });
      console.log(wkt);
      self.wkt = wkt;
    });


    dibujoBar.addControl(tg_linea);
  }

}
