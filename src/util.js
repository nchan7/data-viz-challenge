/**
 * Callback invoked when the value of a UI selector changes
 * @callback onChange
 * @param {string} value - the new value of the UI selector
 */

/**
 * Create a radio group UI selector
 * @param {Object}   config - configuration object
 * @param {string}   config.id - "id" attribute of the HTML container element
 * @param {string}   config.label - text label to display with the component
 * @param {string[]} config.options - array of possible values
 * @param {string}   config.defaultOption - default value
 * @param {onChange} [config.onChange] - callback to invoke when the value changes
 * @param {string}   [config.classNames] - "class" attribute of the container, a space-separated list of CSS classes
 *
 * @returns {HTMLElement} the top-level HTML element for the component
 */
export function createRadioGroup({
  id: containerID,
  label,
  options,
  defaultOption,
  onChange,
  classNames = '',
}) {
  const container = createElementWithAttributes('div', {
    id: containerID,
    class: `selector selector-radio ${classNames}`,
  });
  const radioLabel = createElementWithAttributes('span', {
    id: `${containerID}-label`,
    class: 'selector__label selector-radio__label',
  });
  radioLabel.textContent = label;
  container.appendChild(radioLabel);

  const optionsContainer = createElementWithAttributes('div', { class: 'selector-radio__options' });

  for (const option of options) {
    const optionID = `${containerID}-${option}`;
    const optionElement = createElementWithAttributes('div', { class: 'selector-radio__option' });
    const radioElement = createElementWithAttributes('input', {
      type: 'radio',
      class: 'selector-radio__option-input',
      id: optionID,
      name: containerID,
      value: option,
      checked: option == defaultOption,
    });
    const labelElement = createElementWithAttributes('label', {
      for: optionID,
      class: 'selector-radio__option-label',
    });
    labelElement.textContent = option;
    optionElement.appendChild(radioElement);
    optionElement.appendChild(labelElement);
    optionsContainer.appendChild(optionElement);
  }
  container.appendChild(optionsContainer);

  if (onChange) {
    container.addEventListener('change', ({ target }) => onChange(target.value));
  }

  return container;
}

/**
 * Create a slider UI selector
 * @param {Object}   config - configuration object
 * @param {string}   config.id - "id" attribute of the HTML container element
 * @param {string}   config.label - text label to display with the component
 * @param {number[]} config.range - [min, max] values for the slider range
 * @param {number}   config.defaultOption - default value
 * @param {number}   [config.step] - step interval between values
 * @param {onChange} [config.onChange] - callback to invoke when the value changes
 * @param {string}   [config.classNames] - "class" attribute of the container, a space-separated list of CSS classes
 *
 * @returns {HTMLElement} the top-level HTML element for the component
 */
export function createRangeSlider({
  id: containerID,
  label,
  range: [min, max],
  defaultOption,
  onChange,
  classNames = '',
  step = 1,
}) {
  const name = `${containerID}-input`;
  const container = createElementWithAttributes('div', {
    id: containerID,
    class: `selector selector-range ${classNames}`,
  });
  const labelElement = createElementWithAttributes('label', {
    for: name,
    class: 'selector__label selector-range__label',
  });
  labelElement.textContent = label;
  const inputElement = createElementWithAttributes('input', {
    type: 'range',
    id: name,
    class: 'selector-range__slider',
    min,
    max,
    step,
    value: defaultOption,
  });
  const valueElement = createElementWithAttributes('span', { class: 'selector-range__value' });
  valueElement.textContent = defaultOption;

  container.appendChild(labelElement);
  container.appendChild(inputElement);
  container.appendChild(valueElement);

  if (onChange) {
    inputElement.addEventListener('change', () => {
      const value = inputElement.valueAsNumber;
      valueElement.textContent = value;
      onChange(value);
    });
  }

  return container;
}

/**
 * Create a DOM element with one or more attributes
 * @param {string} tagName - type of the DOM element (e.g. 'div', 'input', 'ul')
 * @param {Object} attributeMap - mapping of attribute names to values
 *
 * @returns {HTMLElement} - the created element
 */
export function createElementWithAttributes(tagName, attributeMap) {
  const element = document.createElement(tagName);
  for (const name of Object.keys(attributeMap)) {
    const value = attributeMap[name];
    if (typeof value != 'boolean' || value) {
      element.setAttribute(name, value);
    }
  }
  return element;
}

/**
 * Load data from a CSV file
 * @param {string} url - URL from which to load the file (absolute or relative path)
 *
 * @returns {Promise} a Promise that either resolves to the parsed CSV data, a PapaParse Parse Result object (see https://www.papaparse.com/docs#results), or rejects with an error
 */
export function loadCSVData(url) {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: resolve,
      error: reject,
    });
  });
}
