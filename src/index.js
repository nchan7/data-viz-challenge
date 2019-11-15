import * as controls from './controls.js';
import * as store from './store.js';
import * as util from './util.js';

const ROOT_ELEMENT_ID = 'app';
const DATA_FILE_URL = 'data/GBD_2017_death_rate_opioid_use_disorders_all_ages.csv';

// Initialize application state using default control options.
store.setState(controls.initialState);

// Get a handle to the root element, in which we'll build the application.
const appContainer = document.getElementById(ROOT_ELEMENT_ID);

// Create UI controls and add to the DOM.
controls.create(appContainer);

// Add visualization container to the DOM. Visualization should be created inside this container.
const vizContainer = util.createElementWithAttributes('main', {
  id: 'viz',
  class: 'viz',
});
appContainer.appendChild(vizContainer);

(async function main() {
  try {
    const parsed = await util.loadCSVData(DATA_FILE_URL);

    console.log(parsed.data);
    // console.table(parsed.data.slice(0, 10));

    // TODO : Visualize the data!
    // Code was sourced from https://datamaps.github.io/ and https://github.com/d3/d3
    var dataset = {};
    // We need to colorize every country based on "death rate"
    // colors should be uniq for every value.
    // For this purpose we create palette(using min/max series-value)
    var meanDeathRates = parsed.data.map( function (obj) 
        { 
          return obj.mean; 
        }
      );
    var sortedMeanDeathRates = meanDeathRates.sort(function (a, b) {  return a - b;  });; 
    var minMeanDeathRate = sortedMeanDeathRates[0];
    var maxMeanDeathRate = sortedMeanDeathRates[sortedMeanDeathRates.length-2];

    // create color palette function
    var paletteScale = d3.scale.linear()
            .domain([minMeanDeathRate,maxMeanDeathRate])
            .range(["#EFEFFF","#02386F"]); // blue color
    // fill dataset in appropriate format
    
    // match countries with country codes
    var countries = Datamap.prototype.worldTopo.objects.world.geometries;
    
    parsed.data.forEach(function(item){ //
        // item example value ["USA", 70]
        for (var i = 0; i < countries.length; i++) {
          if (item.location === countries[i].properties.name) {
            var iso = countries[i].id
          }
        }
        var mean = item.mean;
        dataset[iso] = { meanDeathRate: mean, fillColor: paletteScale(mean) };
    });

    console.log(dataset)
    // render map
    new Datamap({
        element: document.getElementById('container'),
        projection: 'mercator', // big world map
        // countries don't listed in dataset will be painted with this color
        fills: { defaultFill: '#F5F5F5' },
        data: dataset,
        geographyConfig: {
            borderColor: '#DEDEDE',
            highlightBorderWidth: 2,
            // don't change color on mouse hover
            highlightFillColor: function(geo) {
                return geo['fillColor'] || '#F5F5F5';
            },
            // only change border
            highlightBorderColor: '#B7B7B7',
            // show desired information in tooltip
            popupTemplate: function(geo, data) {
                // don't show tooltip if country don't present in dataset
                if (!data) { return ; }
                // tooltip content
                return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>Average Death Rate: <strong>', Math.round(10*data.meanDeathRate)/10, '</strong>',
                    '</div>'].join('');
            }
        }
    });




  } catch (err) {
    vizContainer.textContent = 'Error loading data.';
  }
})();
