import * as store from './store.js';
import * as util from './util.js';

const sexSelectSettings = {
  id: 'sex-selector',
  classNames: 'sex-selector',
  label: 'Sex',
  options: ['Both', 'Female', 'Male'],
  defaultOption: 'Both',
  onChange: store.setSex,
};

const yearSelectSettings = {
  id: 'year-selector',
  classNames: 'year-selector',
  label: 'Year',
  range: [1990, 2017],
  defaultOption: 2017,
  onChange: store.setYear,
};

export const initialState = {
  sex: sexSelectSettings.defaultOption,
  year: yearSelectSettings.defaultOption,
};

/**
 * Create UI controls
 * @param {HTMLElement} containerElement - HTML element to which controls will be appended
 * @returns {void}
 */
export function create(containerElement) {
  const sexSelector = util.createRadioGroup(sexSelectSettings);
  const yearSelector = util.createRangeSlider(yearSelectSettings);

  const controlsContainer = util.createElementWithAttributes('div', {
    id: 'controls',
    class: 'controls',
  });
  controlsContainer.appendChild(sexSelector);
  controlsContainer.appendChild(yearSelector);

  containerElement.appendChild(controlsContainer);
}
