/**
 * State object; will be replaced with a brand new object on each update
 */
let state = {};

/**
 * Collection of functions subscribed to state updates
 */
const subscriptions = new Set();

/**
 * Get the current state
 * @returns {Object} state object
 */
export function getState() {
  return state;
}

/**
 * Set state
 * @param {Object} newState - object to merge into the current state object to produce a new state
 * @returns {void}
 */
export function setState(newState) {
  // Merge the new state object into the old.
  state = { ...state, ...newState };
  // Notify subscribers of the update.
  for (const subscription of subscriptions.values()) {
    subscription(state);
  }
}

/**
 * Convenience function: Set `state.year`
 * @param {number} year - new year value
 * @returns {void}
 */
export function setYear(year) {
  setState({ year });
}

/**
 * Convenience function: Set `state.sex`
 * @param {string} sex - new sex value
 * @returns {void}
 */
export function setSex(sex) {
  setState({ sex });
}

/**
 * Callback to be invoked when state changes
 * @callback onUpdate
 * @param {Object} state - the new state object
 */

/**
 * Object representing a cancellable subscription
 * @typedef {Object} Cancellable
 * @property {function} cancel - a function that cancels the subscription
 */

/**
 * Subscribe a callback function to state updates
 * @param {onUpdate} onUpdate - callback to invoke when state changes
 * @returns {Cancellable} a handle to the subscription that allows cancellation
 */
export function subscribe(onUpdate) {
  subscriptions.add(onUpdate);
  return { cancel: () => subscriptions.delete(onUpdate) };
}
