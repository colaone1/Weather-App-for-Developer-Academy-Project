const { toMatchImageSnapshot } = require('jest-image-snapshot');
const puppeteer = require('puppeteer');

class VisualRegression {
  constructor() {
    this.browser = null;
    this.page = null;
    this.snapshots = new Map();
    this.diffThreshold = 0.1;
    this.failureThreshold = 0.01;
  }

  /**
   * Initialize the browser and page
   */
  async init() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1280, height: 800 });
  }

  /**
   * Close the browser
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  /**
   * Take a screenshot of a component
   * @param {string} componentName - Name of the component
   * @param {Object} props - Props to pass to the component
   * @returns {Promise<Buffer>} Screenshot buffer
   */
  async takeScreenshot(componentName, props = {}) {
    if (!this.page) {
      await this.init();
    }

    await this.page.goto(`http://localhost:3000/visual-test/${componentName}`, {
      waitUntil: 'networkidle0'
    });

    const element = await this.page.$('[data-testid="component-container"]');
    const screenshot = await element.screenshot();
    this.snapshots.set(componentName, screenshot);

    return screenshot;
  }

  /**
   * Compare a screenshot with a baseline
   * @param {string} componentName - Name of the component
   * @param {Buffer} screenshot - Screenshot to compare
   * @returns {Object} Comparison result
   */
  async compareScreenshot(componentName, screenshot) {
    const baseline = this.snapshots.get(componentName);
    if (!baseline) {
      throw new Error(`No baseline found for component: ${componentName}`);
    }

    const result = await toMatchImageSnapshot(screenshot, {
      customDiffConfig: {
        threshold: this.diffThreshold
      },
      failureThreshold: this.failureThreshold,
      failureThresholdType: 'percent'
    });

    return result;
  }

  /**
   * Update the baseline for a component
   * @param {string} componentName - Name of the component
   * @param {Buffer} screenshot - New baseline screenshot
   */
  updateBaseline(componentName, screenshot) {
    this.snapshots.set(componentName, screenshot);
  }

  /**
   * Test a component's visual appearance
   * @param {string} componentName - Name of the component
   * @param {Object} props - Props to pass to the component
   * @returns {Object} Test result
   */
  async testComponent(componentName, props = {}) {
    const screenshot = await this.takeScreenshot(componentName, props);
    const result = await this.compareScreenshot(componentName, screenshot);
    return result;
  }

  /**
   * Test a component's responsive design
   * @param {string} componentName - Name of the component
   * @param {Object} props - Props to pass to the component
   * @param {Array<Object>} viewports - Array of viewport sizes to test
   * @returns {Array<Object>} Test results for each viewport
   */
  async testResponsiveDesign(componentName, props = {}, viewports = []) {
    const results = [];

    for (const viewport of viewports) {
      await this.page.setViewport(viewport);
      const screenshot = await this.takeScreenshot(componentName, props);
      const result = await this.compareScreenshot(componentName, screenshot);
      results.push({ viewport, result });
    }

    return results;
  }

  /**
   * Test a component's theme variations
   * @param {string} componentName - Name of the component
   * @param {Object} props - Props to pass to the component
   * @param {Array<string>} themes - Array of themes to test
   * @returns {Array<Object>} Test results for each theme
   */
  async testThemes(componentName, props = {}, themes = []) {
    const results = [];

    for (const theme of themes) {
      await this.page.evaluate((theme) => {
        document.documentElement.setAttribute('data-theme', theme);
      }, theme);

      const screenshot = await this.takeScreenshot(componentName, props);
      const result = await this.compareScreenshot(componentName, screenshot);
      results.push({ theme, result });
    }

    return results;
  }

  /**
   * Test a component's state variations
   * @param {string} componentName - Name of the component
   * @param {Object} props - Props to pass to the component
   * @param {Array<Object>} states - Array of states to test
   * @returns {Array<Object>} Test results for each state
   */
  async testStates(componentName, props = {}, states = []) {
    const results = [];

    for (const state of states) {
      await this.page.evaluate((state) => {
        window.__TEST_STATE__ = state;
      }, state);

      const screenshot = await this.takeScreenshot(componentName, props);
      const result = await this.compareScreenshot(componentName, screenshot);
      results.push({ state, result });
    }

    return results;
  }

  /**
   * Test a component's interaction states
   * @param {string} componentName - Name of the component
   * @param {Object} props - Props to pass to the component
   * @param {Array<Object>} interactions - Array of interactions to test
   * @returns {Array<Object>} Test results for each interaction
   */
  async testInteractions(componentName, props = {}, interactions = []) {
    const results = [];

    for (const interaction of interactions) {
      await this.page.evaluate((interaction) => {
        const element = document.querySelector(interaction.selector);
        if (element) {
          element.dispatchEvent(new Event(interaction.event));
        }
      }, interaction);

      const screenshot = await this.takeScreenshot(componentName, props);
      const result = await this.compareScreenshot(componentName, screenshot);
      results.push({ interaction, result });
    }

    return results;
  }

  /**
   * Test a component's animation states
   * @param {string} componentName - Name of the component
   * @param {Object} props - Props to pass to the component
   * @param {Array<Object>} animations - Array of animations to test
   * @returns {Array<Object>} Test results for each animation
   */
  async testAnimations(componentName, props = {}, animations = []) {
    const results = [];

    for (const animation of animations) {
      await this.page.evaluate((animation) => {
        const element = document.querySelector(animation.selector);
        if (element) {
          element.style.animation = animation.value;
        }
      }, animation);

      const screenshot = await this.takeScreenshot(componentName, props);
      const result = await this.compareScreenshot(componentName, screenshot);
      results.push({ animation, result });
    }

    return results;
  }

  /**
   * Test a component's accessibility
   * @param {string} componentName - Name of the component
   * @param {Object} props - Props to pass to the component
   * @returns {Object} Accessibility test result
   */
  async testAccessibility(componentName, props = {}) {
    await this.takeScreenshot(componentName, props);

    const accessibilityTree = await this.page.accessibility.snapshot();
    const violations = await this.page.evaluate(() => {
      return window.axe.run(document.body);
    });

    return {
      accessibilityTree,
      violations
    };
  }

  /**
   * Test a component's performance
   * @param {string} componentName - Name of the component
   * @param {Object} props - Props to pass to the component
   * @returns {Object} Performance metrics
   */
  async testPerformance(componentName, props = {}) {
    const metrics = await this.page.metrics();
    const performance = await this.page.evaluate(() => {
      return window.performance.toJSON();
    });

    return {
      metrics,
      performance
    };
  }

  /**
   * Test a component's memory usage
   * @param {string} componentName - Name of the component
   * @param {Object} props - Props to pass to the component
   * @returns {Object} Memory usage metrics
   */
  async testMemoryUsage(componentName, props = {}) {
    const memory = await this.page.evaluate(() => {
      return window.performance.memory;
    });

    return memory;
  }

  /**
   * Test a component's network usage
   * @param {string} componentName - Name of the component
   * @param {Object} props - Props to pass to the component
   * @returns {Object} Network usage metrics
   */
  async testNetworkUsage(componentName, props = {}) {
    const network = await this.page.evaluate(() => {
      return window.performance.getEntriesByType('resource');
    });

    return network;
  }

  /**
   * Test a component's CPU usage
   * @param {string} componentName - Name of the component
   * @param {Object} props - Props to pass to the component
   * @returns {Object} CPU usage metrics
   */
  async testCPUUsage(componentName, props = {}) {
    const cpu = await this.page.evaluate(() => {
      return window.performance.now();
    });

    return cpu;
  }

  /**
   * Test a component's GPU usage
   * @param {string} componentName - Name of the component
   * @param {Object} props - Props to pass to the component
   * @returns {Object} GPU usage metrics
   */
  async testGPUUsage(componentName, props = {}) {
    const gpu = await this.page.evaluate(() => {
      return window.performance.getEntriesByType('paint');
    });

    return gpu;
  }

  /**
   * Test a component's layout performance
   * @param {string} componentName - Name of the component
   * @param {Object} props - Props to pass to the component
   * @returns {Object} Layout performance metrics
   */
  async testLayoutPerformance(componentName, props = {}) {
    const layout = await this.page.evaluate(() => {
      return window.performance.getEntriesByType('layout');
    });

    return layout;
  }

  /**
   * Test a component's rendering performance
   * @param {string} componentName - Name of the component
   * @param {Object} props - Props to pass to the component
   * @returns {Object} Rendering performance metrics
   */
  async testRenderingPerformance(componentName, props = {}) {
    const rendering = await this.page.evaluate(() => {
      return window.performance.getEntriesByType('render');
    });

    return rendering;
  }

  /**
   * Test a component's script performance
   * @param {string} componentName - Name of the component
   * @param {Object} props - Props to pass to the component
   * @returns {Object} Script performance metrics
   */
  async testScriptPerformance(componentName, props = {}) {
    const script = await this.page.evaluate(() => {
      return window.performance.getEntriesByType('script');
    });

    return script;
  }

  /**
   * Test a component's style performance
   * @param {string} componentName - Name of the component
   * @param {Object} props - Props to pass to the component
   * @returns {Object} Style performance metrics
   */
  async testStylePerformance(componentName, props = {}) {
    const style = await this.page.evaluate(() => {
      return window.performance.getEntriesByType('style');
    });

    return style;
  }

  /**
   * Test a component's resource performance
   * @param {string} componentName - Name of the component
   * @param {Object} props - Props to pass to the component
   * @returns {Object} Resource performance metrics
   */
  async testResourcePerformance(componentName, props = {}) {
    const resource = await this.page.evaluate(() => {
      return window.performance.getEntriesByType('resource');
    });

    return resource;
  }

  /**
   * Test a component's navigation performance
   * @param {string} componentName - Name of the component
   * @param {Object} props - Props to pass to the component
   * @returns {Object} Navigation performance metrics
   */
  async testNavigationPerformance(componentName, props = {}) {
    const navigation = await this.page.evaluate(() => {
      return window.performance.getEntriesByType('navigation');
    });

    return navigation;
  }

  /**
   * Test a component's user timing performance
   * @param {string} componentName - Name of the component
   * @param {Object} props - Props to pass to the component
   * @returns {Object} User timing performance metrics
   */
  async testUserTimingPerformance(componentName, props = {}) {
    const userTiming = await this.page.evaluate(() => {
      return window.performance.getEntriesByType('user');
    });

    return userTiming;
  }

  /**
   * Test a component's mark performance
   * @param {string} componentName - Name of the component
   * @param {Object} props - Props to pass to the component
   * @returns {Object} Mark performance metrics
   */
  async testMarkPerformance(componentName, props = {}) {
    const mark = await this.page.evaluate(() => {
      return window.performance.getEntriesByType('mark');
    });

    return mark;
  }

  /**
   * Test a component's measure performance
   * @param {string} componentName - Name of the component
   * @param {Object} props - Props to pass to the component
   * @returns {Object} Measure performance metrics
   */
  async testMeasurePerformance(componentName, props = {}) {
    const measure = await this.page.evaluate(() => {
      return window.performance.getEntriesByType('measure');
    });

    return measure;
  }
}

module.exports = new VisualRegression(); 