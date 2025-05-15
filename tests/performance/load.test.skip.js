/* eslint-disable @typescript-eslint/no-require-imports */
const chai = require('chai');
const chaiHttp = require('chai-http');
const { performance } = require('perf_hooks');

chai.use(chaiHttp);
const expect = chai.expect;

describe.skip('Performance Tests', () => {
  const baseUrl = 'http://localhost:8000';
  const testCities = ['London', 'Paris', 'New York', 'Tokyo', 'Sydney'];
  
  describe('API Response Time Tests', () => {
    testCities.forEach(city => {
      it(`should respond within 500ms for ${city} weather request`, async () => {
        const start = performance.now();
        
        const response = await chai
          .request(baseUrl)
          .get('/api/weatherbycity')
          .query({ city });
        
        const end = performance.now();
        const responseTime = end - start;
        
        expect(responseTime).to.be.below(500);
        expect(response).to.have.status(200);
      });
    });
  });

  describe('Concurrent Request Handling', () => {
    it('should handle 10 concurrent requests within 2 seconds', async () => {
      const start = performance.now();
      
      const requests = testCities.map(city => 
        chai
          .request(baseUrl)
          .get('/api/weatherbycity')
          .query({ city })
      );
      
      const responses = await Promise.all(requests);
      const end = performance.now();
      const totalTime = end - start;
      
      expect(totalTime).to.be.below(2000);
      responses.forEach(response => {
        expect(response).to.have.status(200);
      });
    });

    it('should handle 50 concurrent requests with rate limiting', async () => {
      const start = performance.now();
      const requests = Array(50).fill().map(() => 
        chai
          .request(baseUrl)
          .get('/api/weatherbycity')
          .query({ city: testCities[Math.floor(Math.random() * testCities.length)] })
      );
      
      const responses = await Promise.all(requests);
      const end = performance.now();
      const totalTime = end - start;
      
      expect(totalTime).to.be.below(5000);
      responses.forEach(response => {
        expect(response).to.have.status(200);
      });
    });
  });

  describe('Memory Usage', () => {
    it('should maintain stable memory usage under load', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Make 50 requests
      for (let i = 0; i < 50; i++) {
        await chai
          .request(baseUrl)
          .get('/api/weatherbycity')
          .query({ city: testCities[i % testCities.length] });
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be less than 50MB
      expect(memoryIncrease).to.be.below(50 * 1024 * 1024);
    });

    it('should handle memory spikes gracefully', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      const memorySnapshots = [];
      
      // Make requests with increasing complexity
      for (let i = 0; i < 20; i++) {
        await chai
          .request(baseUrl)
          .get('/api/forecast')
          .query({ city: testCities[i % testCities.length] });
        
        memorySnapshots.push(process.memoryUsage().heapUsed);
      }
      
      // Check for memory leaks
      const maxMemory = Math.max(...memorySnapshots);
      const memoryGrowth = maxMemory - initialMemory;
      
      expect(memoryGrowth).to.be.below(100 * 1024 * 1024); // 100MB max growth
    });
  });

  describe('Error Recovery', () => {
    it('should recover from temporary failures', async () => {
      const start = performance.now();
      
      // Simulate temporary failures
      const requests = testCities.map(city => 
        chai
          .request(baseUrl)
          .get('/api/weatherbycity')
          .query({ city })
          .set('X-Simulate-Error', 'true')
      );
      
      const responses = await Promise.all(requests);
      const end = performance.now();
      const totalTime = end - start;
      
      expect(totalTime).to.be.below(3000);
      responses.forEach(response => {
        expect(response).to.have.status(200);
      });
    });
  });

  describe('Cache Performance', () => {
    it('should improve response time with caching', async () => {
      // First request (cache miss)
      const start1 = performance.now();
      await chai
        .request(baseUrl)
        .get('/api/weatherbycity')
        .query({ city: 'London' });
      const time1 = performance.now() - start1;
      
      // Second request (cache hit)
      const start2 = performance.now();
      await chai
        .request(baseUrl)
        .get('/api/weatherbycity')
        .query({ city: 'London' });
      const time2 = performance.now() - start2;
      
      // Cache hit should be significantly faster
      expect(time2).to.be.below(time1 * 0.5);
    });
  });
}); 