const { performance } = require('perf_hooks');

class PerformanceBenchmark {
  constructor() {
    this.metrics = new Map();
    this.startTimes = new Map();
    this.memoryUsage = new Map();
  }

  /**
   * Start measuring performance for a given operation
   * @param {string} operation - Name of the operation to measure
   */
  start(operation) {
    this.startTimes.set(operation, performance.now());
    if (global.gc) {
      global.gc();
      this.memoryUsage.set(operation, process.memoryUsage());
    }
  }

  /**
   * End measuring performance for a given operation
   * @param {string} operation - Name of the operation to measure
   * @returns {Object} Performance metrics for the operation
   */
  end(operation) {
    const startTime = this.startTimes.get(operation);
    if (!startTime) {
      throw new Error(`No start time found for operation: ${operation}`);
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    const metrics = {
      duration,
      timestamp: new Date().toISOString(),
      operation
    };

    if (global.gc) {
      const startMemory = this.memoryUsage.get(operation);
      const endMemory = process.memoryUsage();
      metrics.memory = {
        heapUsed: endMemory.heapUsed - startMemory.heapUsed,
        heapTotal: endMemory.heapTotal - startMemory.heapTotal,
        external: endMemory.external - startMemory.external,
        rss: endMemory.rss - startMemory.rss
      };
    }

    this.metrics.set(operation, metrics);
    this.startTimes.delete(operation);
    this.memoryUsage.delete(operation);

    return metrics;
  }

  /**
   * Get performance metrics for a specific operation
   * @param {string} operation - Name of the operation
   * @returns {Object} Performance metrics for the operation
   */
  getMetrics(operation) {
    return this.metrics.get(operation);
  }

  /**
   * Get all performance metrics
   * @returns {Map} Map of all performance metrics
   */
  getAllMetrics() {
    return this.metrics;
  }

  /**
   * Clear all performance metrics
   */
  clear() {
    this.metrics.clear();
    this.startTimes.clear();
    this.memoryUsage.clear();
  }

  /**
   * Measure performance of a function
   * @param {Function} fn - Function to measure
   * @param {string} operation - Name of the operation
   * @param {Array} args - Arguments to pass to the function
   * @returns {Object} Performance metrics and function result
   */
  async measureFunction(fn, operation, ...args) {
    this.start(operation);
    const result = await fn(...args);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a component render
   * @param {Function} renderFn - Function that renders the component
   * @param {string} operation - Name of the operation
   * @param {Object} props - Props to pass to the component
   * @returns {Object} Performance metrics and rendered component
   */
  async measureRender(renderFn, operation, props = {}) {
    this.start(operation);
    const component = await renderFn(props);
    const metrics = this.end(operation);
    return { metrics, component };
  }

  /**
   * Measure performance of a state update
   * @param {Function} updateFn - Function that updates the state
   * @param {string} operation - Name of the operation
   * @param {Object} state - Initial state
   * @returns {Object} Performance metrics and updated state
   */
  async measureStateUpdate(updateFn, operation, state) {
    this.start(operation);
    const newState = await updateFn(state);
    const metrics = this.end(operation);
    return { metrics, state: newState };
  }

  /**
   * Measure performance of an API call
   * @param {Function} apiCall - Function that makes the API call
   * @param {string} operation - Name of the operation
   * @param {Object} params - Parameters for the API call
   * @returns {Object} Performance metrics and API response
   */
  async measureApiCall(apiCall, operation, params = {}) {
    this.start(operation);
    const response = await apiCall(params);
    const metrics = this.end(operation);
    return { metrics, response };
  }

  /**
   * Measure performance of a user interaction
   * @param {Function} interactionFn - Function that simulates user interaction
   * @param {string} operation - Name of the operation
   * @param {Object} element - Element to interact with
   * @returns {Object} Performance metrics and interaction result
   */
  async measureUserInteraction(interactionFn, operation, element) {
    this.start(operation);
    const result = await interactionFn(element);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a form submission
   * @param {Function} submitFn - Function that submits the form
   * @param {string} operation - Name of the operation
   * @param {Object} formData - Form data to submit
   * @returns {Object} Performance metrics and submission result
   */
  async measureFormSubmission(submitFn, operation, formData) {
    this.start(operation);
    const result = await submitFn(formData);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a data transformation
   * @param {Function} transformFn - Function that transforms the data
   * @param {string} operation - Name of the operation
   * @param {Object} data - Data to transform
   * @returns {Object} Performance metrics and transformed data
   */
  async measureDataTransformation(transformFn, operation, data) {
    this.start(operation);
    const transformedData = await transformFn(data);
    const metrics = this.end(operation);
    return { metrics, data: transformedData };
  }

  /**
   * Measure performance of a file operation
   * @param {Function} fileOpFn - Function that performs the file operation
   * @param {string} operation - Name of the operation
   * @param {string} filePath - Path to the file
   * @returns {Object} Performance metrics and operation result
   */
  async measureFileOperation(fileOpFn, operation, filePath) {
    this.start(operation);
    const result = await fileOpFn(filePath);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a database operation
   * @param {Function} dbOpFn - Function that performs the database operation
   * @param {string} operation - Name of the operation
   * @param {Object} query - Database query
   * @returns {Object} Performance metrics and operation result
   */
  async measureDatabaseOperation(dbOpFn, operation, query) {
    this.start(operation);
    const result = await dbOpFn(query);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a network request
   * @param {Function} requestFn - Function that makes the network request
   * @param {string} operation - Name of the operation
   * @param {Object} options - Request options
   * @returns {Object} Performance metrics and request response
   */
  async measureNetworkRequest(requestFn, operation, options = {}) {
    this.start(operation);
    const response = await requestFn(options);
    const metrics = this.end(operation);
    return { metrics, response };
  }

  /**
   * Measure performance of a cache operation
   * @param {Function} cacheOpFn - Function that performs the cache operation
   * @param {string} operation - Name of the operation
   * @param {string} key - Cache key
   * @returns {Object} Performance metrics and operation result
   */
  async measureCacheOperation(cacheOpFn, operation, key) {
    this.start(operation);
    const result = await cacheOpFn(key);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a worker operation
   * @param {Function} workerOpFn - Function that performs the worker operation
   * @param {string} operation - Name of the operation
   * @param {Object} data - Data to process
   * @returns {Object} Performance metrics and operation result
   */
  async measureWorkerOperation(workerOpFn, operation, data) {
    this.start(operation);
    const result = await workerOpFn(data);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a WebSocket operation
   * @param {Function} wsOpFn - Function that performs the WebSocket operation
   * @param {string} operation - Name of the operation
   * @param {Object} message - Message to send
   * @returns {Object} Performance metrics and operation result
   */
  async measureWebSocketOperation(wsOpFn, operation, message) {
    this.start(operation);
    const result = await wsOpFn(message);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a WebGL operation
   * @param {Function} webglOpFn - Function that performs the WebGL operation
   * @param {string} operation - Name of the operation
   * @param {Object} params - Operation parameters
   * @returns {Object} Performance metrics and operation result
   */
  async measureWebGLOperation(webglOpFn, operation, params) {
    this.start(operation);
    const result = await webglOpFn(params);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a Web Audio operation
   * @param {Function} audioOpFn - Function that performs the Web Audio operation
   * @param {string} operation - Name of the operation
   * @param {Object} audioData - Audio data to process
   * @returns {Object} Performance metrics and operation result
   */
  async measureWebAudioOperation(audioOpFn, operation, audioData) {
    this.start(operation);
    const result = await audioOpFn(audioData);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a Web Crypto operation
   * @param {Function} cryptoOpFn - Function that performs the Web Crypto operation
   * @param {string} operation - Name of the operation
   * @param {Object} data - Data to process
   * @returns {Object} Performance metrics and operation result
   */
  async measureWebCryptoOperation(cryptoOpFn, operation, data) {
    this.start(operation);
    const result = await cryptoOpFn(data);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a Web Animation operation
   * @param {Function} animationOpFn - Function that performs the Web Animation operation
   * @param {string} operation - Name of the operation
   * @param {Object} animationData - Animation data
   * @returns {Object} Performance metrics and operation result
   */
  async measureWebAnimationOperation(animationOpFn, operation, animationData) {
    this.start(operation);
    const result = await animationOpFn(animationData);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a Web Storage operation
   * @param {Function} storageOpFn - Function that performs the Web Storage operation
   * @param {string} operation - Name of the operation
   * @param {Object} data - Data to store
   * @returns {Object} Performance metrics and operation result
   */
  async measureWebStorageOperation(storageOpFn, operation, data) {
    this.start(operation);
    const result = await storageOpFn(data);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a Web Worker operation
   * @param {Function} workerOpFn - Function that performs the Web Worker operation
   * @param {string} operation - Name of the operation
   * @param {Object} data - Data to process
   * @returns {Object} Performance metrics and operation result
   */
  async measureWebWorkerOperation(workerOpFn, operation, data) {
    this.start(operation);
    const result = await workerOpFn(data);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a Service Worker operation
   * @param {Function} serviceWorkerOpFn - Function that performs the Service Worker operation
   * @param {string} operation - Name of the operation
   * @param {Object} request - Request to handle
   * @returns {Object} Performance metrics and operation result
   */
  async measureServiceWorkerOperation(serviceWorkerOpFn, operation, request) {
    this.start(operation);
    const result = await serviceWorkerOpFn(request);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a Web Push operation
   * @param {Function} pushOpFn - Function that performs the Web Push operation
   * @param {string} operation - Name of the operation
   * @param {Object} subscription - Push subscription
   * @returns {Object} Performance metrics and operation result
   */
  async measureWebPushOperation(pushOpFn, operation, subscription) {
    this.start(operation);
    const result = await pushOpFn(subscription);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a Web Share operation
   * @param {Function} shareOpFn - Function that performs the Web Share operation
   * @param {string} operation - Name of the operation
   * @param {Object} data - Data to share
   * @returns {Object} Performance metrics and operation result
   */
  async measureWebShareOperation(shareOpFn, operation, data) {
    this.start(operation);
    const result = await shareOpFn(data);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a Web Payment operation
   * @param {Function} paymentOpFn - Function that performs the Web Payment operation
   * @param {string} operation - Name of the operation
   * @param {Object} paymentRequest - Payment request
   * @returns {Object} Performance metrics and operation result
   */
  async measureWebPaymentOperation(paymentOpFn, operation, paymentRequest) {
    this.start(operation);
    const result = await paymentOpFn(paymentRequest);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a Web Authentication operation
   * @param {Function} authOpFn - Function that performs the Web Authentication operation
   * @param {string} operation - Name of the operation
   * @param {Object} credentials - Authentication credentials
   * @returns {Object} Performance metrics and operation result
   */
  async measureWebAuthenticationOperation(authOpFn, operation, credentials) {
    this.start(operation);
    const result = await authOpFn(credentials);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a Web Bluetooth operation
   * @param {Function} bluetoothOpFn - Function that performs the Web Bluetooth operation
   * @param {string} operation - Name of the operation
   * @param {Object} device - Bluetooth device
   * @returns {Object} Performance metrics and operation result
   */
  async measureWebBluetoothOperation(bluetoothOpFn, operation, device) {
    this.start(operation);
    const result = await bluetoothOpFn(device);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a Web USB operation
   * @param {Function} usbOpFn - Function that performs the Web USB operation
   * @param {string} operation - Name of the operation
   * @param {Object} device - USB device
   * @returns {Object} Performance metrics and operation result
   */
  async measureWebUSBOperation(usbOpFn, operation, device) {
    this.start(operation);
    const result = await usbOpFn(device);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a Web Serial operation
   * @param {Function} serialOpFn - Function that performs the Web Serial operation
   * @param {string} operation - Name of the operation
   * @param {Object} port - Serial port
   * @returns {Object} Performance metrics and operation result
   */
  async measureWebSerialOperation(serialOpFn, operation, port) {
    this.start(operation);
    const result = await serialOpFn(port);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a Web MIDI operation
   * @param {Function} midiOpFn - Function that performs the Web MIDI operation
   * @param {string} operation - Name of the operation
   * @param {Object} device - MIDI device
   * @returns {Object} Performance metrics and operation result
   */
  async measureWebMIDIOperation(midiOpFn, operation, device) {
    this.start(operation);
    const result = await midiOpFn(device);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a Web NFC operation
   * @param {Function} nfcOpFn - Function that performs the Web NFC operation
   * @param {string} operation - Name of the operation
   * @param {Object} tag - NFC tag
   * @returns {Object} Performance metrics and operation result
   */
  async measureWebNFCOperation(nfcOpFn, operation, tag) {
    this.start(operation);
    const result = await nfcOpFn(tag);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a Web HID operation
   * @param {Function} hidOpFn - Function that performs the Web HID operation
   * @param {string} operation - Name of the operation
   * @param {Object} device - HID device
   * @returns {Object} Performance metrics and operation result
   */
  async measureWebHIDOperation(hidOpFn, operation, device) {
    this.start(operation);
    const result = await hidOpFn(device);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a Web Gamepad operation
   * @param {Function} gamepadOpFn - Function that performs the Web Gamepad operation
   * @param {string} operation - Name of the operation
   * @param {Object} gamepad - Gamepad device
   * @returns {Object} Performance metrics and operation result
   */
  async measureWebGamepadOperation(gamepadOpFn, operation, gamepad) {
    this.start(operation);
    const result = await gamepadOpFn(gamepad);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a Web VR operation
   * @param {Function} vrOpFn - Function that performs the Web VR operation
   * @param {string} operation - Name of the operation
   * @param {Object} device - VR device
   * @returns {Object} Performance metrics and operation result
   */
  async measureWebVROperation(vrOpFn, operation, device) {
    this.start(operation);
    const result = await vrOpFn(device);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a Web AR operation
   * @param {Function} arOpFn - Function that performs the Web AR operation
   * @param {string} operation - Name of the operation
   * @param {Object} device - AR device
   * @returns {Object} Performance metrics and operation result
   */
  async measureWebAROperation(arOpFn, operation, device) {
    this.start(operation);
    const result = await arOpFn(device);
    const metrics = this.end(operation);
    return { metrics, result };
  }

  /**
   * Measure performance of a Web XR operation
   * @param {Function} xrOpFn - Function that performs the Web XR operation
   * @param {string} operation - Name of the operation
   * @param {Object} session - XR session
   * @returns {Object} Performance metrics and operation result
   */
  async measureWebXROperation(xrOpFn, operation, session) {
    this.start(operation);
    const result = await xrOpFn(session);
    const metrics = this.end(operation);
    return { metrics, result };
  }
}

module.exports = new PerformanceBenchmark(); 