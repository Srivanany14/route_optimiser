import React, { useEffect, useRef, useState } from 'react';

const ChoroplethMap = () => {
  const mapRef = useRef(null);
  const [selectedState, setSelectedState] = useState(null);

  useEffect(() => {
    let map;
    let geojson;
    let info;
    let legend;

    const initMap = async () => {
      // Load Leaflet CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(css);
      }

      // Load Leaflet JS
      if (!window.L) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }

      if (!mapRef.current || !window.L) return;

      // Initialize map (following Leaflet docs exactly)
      map = window.L.map(mapRef.current).setView([37.8, -96], 4);

      // Add tile layer (following Leaflet docs exactly)
      const tiles = window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      // Color function (following Leaflet docs exactly)
      function getColor(d) {
        return d > 1000 ? '#800026' :
               d > 500  ? '#BD0026' :
               d > 200  ? '#E31A1C' :
               d > 100  ? '#FC4E2A' :
               d > 50   ? '#FD8D3C' :
               d > 20   ? '#FEB24C' :
               d > 10   ? '#FED976' :
                         '#FFEDA0';
      }

      // Style function (following Leaflet docs exactly)
      function style(feature) {
        return {
          fillColor: getColor(feature.properties.density),
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7
        };
      }

      // Interaction functions (following Leaflet docs exactly)
      function highlightFeature(e) {
        const layer = e.target;

        layer.setStyle({
          weight: 5,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.7
        });

        layer.bringToFront();
        info.update(layer.feature.properties);
      }

      function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
      }

      function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
      }

      function onEachFeature(feature, layer) {
        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: zoomToFeature
        });
      }

      // Load states data from the us-states.js file
      let statesData;
      try {
        // Since it's a .js file with var statesData, we need to load it differently
        // First, let's try to access it if it's already loaded globally
        if (window.statesData) {
          statesData = window.statesData;
        } else {
          // Load the script dynamically
          const script = document.createElement('script');
          script.src = '/us-states.js';
          document.head.appendChild(script);
          
          await new Promise((resolve, reject) => {
            script.onload = () => {
              if (window.statesData) {
                statesData = window.statesData;
                resolve();
              } else {
                reject(new Error('statesData not found after loading script'));
              }
            };
            script.onerror = () => reject(new Error('Failed to load us-states.js'));
          });
        }

        console.log('Loaded states data:', statesData);

        // Add GeoJSON layer (following Leaflet docs exactly)
        geojson = window.L.geoJson(statesData, {
          style: style,
          onEachFeature: onEachFeature
        }).addTo(map);

      } catch (error) {
        console.error('Error loading states data:', error);
        // Show error message to user
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `
          <div style="padding: 20px; background: #fee; border: 1px solid #fcc; border-radius: 4px; margin: 20px;">
            <h4>Error loading map data</h4>
            <p>Could not load us-states.js. Please ensure the file is in your public folder.</p>
            <p>Error: ${error.message}</p>
          </div>
        `;
        mapRef.current.appendChild(errorDiv);
        return;
      }

      // Custom info control (following Leaflet docs exactly)
      info = window.L.control();

      info.onAdd = function (map) {
        this._div = window.L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
      };

      info.update = function (props) {
        this._div.innerHTML = '<h4>US Traffic congestion Density</h4>' + (props ?
          '<b>' + props.name + '</b><br />' + props.density + ' congestion / mi<sup>2</sup>'
          : 'Hover over a state');
        
        // Update React state
        if (props) {
          setSelectedState(props);
        } else {
          setSelectedState(null);
        }
      };

      info.addTo(map);

      // Custom legend control (following Leaflet docs exactly)
      legend = window.L.control({position: 'bottomright'});

      legend.onAdd = function (map) {
        const div = window.L.DomUtil.create('div', 'info legend');
        const grades = [0, 10, 20, 50, 100, 200, 500, 1000];

        // Loop through density intervals and generate a label with colored square
        for (let i = 0; i < grades.length; i++) {
          div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
      };

      legend.addTo(map);

      // Add CSS styles (following Leaflet docs exactly)
      if (!document.querySelector('#choropleth-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'choropleth-styles';
        styleElement.textContent = `
          .info {
            padding: 6px 8px;
            font: 14px/16px Arial, Helvetica, sans-serif;
            background: white;
            background: rgba(255,255,255,0.8);
            box-shadow: 0 0 15px rgba(0,0,0,0.2);
            border-radius: 5px;
          }
          .info h4 {
            margin: 0 0 5px;
            color: #777;
          }
          .legend {
            line-height: 18px;
            color: #555;
          }
          .legend i {
            width: 18px;
            height: 18px;
            float: left;
            margin-right: 8px;
            opacity: 0.7;
          }
        `;
        document.head.appendChild(styleElement);
      }
    };

    initMap();

    // Cleanup function
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-slate-900">
            US traffic Congestion Density Choropleth
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Interactive choropleth map showing traffic Congestion across US states
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div 
            ref={mapRef} 
            className="w-full h-96"
            style={{ minHeight: '500px' }}
          />
          
          {selectedState && (
            <div className="p-6 bg-gradient-to-r from-blue-50 to-slate-50 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {selectedState.name}
                  </h3>
                  <p className="text-slate-600">
                    Congestion density: {selectedState.density} occurences per square mile
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-3xl font-bold text-blue-600">
                    {selectedState.density}
                  </div>
                  <div className="text-sm text-slate-600">congestion / mi²</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Click on any state to zoom in • Hover for detailed information
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChoroplethMap;