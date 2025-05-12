import chai from 'chai';
import chaiHttp from 'chai-http';
import { performance } from 'perf_hooks';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Performance Tests', () => {
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
  });
}); 