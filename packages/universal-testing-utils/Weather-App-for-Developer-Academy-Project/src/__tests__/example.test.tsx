import React from 'react';
import { render, screen } from '../core/render';
import { createUserFactory } from '../factories/user';
import { createPerformanceTracker } from '../performance/metrics';

describe('Example Test Suite', () => {
  it('should render user information correctly', () => {
    const user = createUserFactory().build();
    render(<div data-testid="user-info">{user.name}</div>);
    
    expect(screen.getByTestId('user-info')).toHaveTextContent(user.name);
  });

  it('should handle multiple users', () => {
    const users = createUserFactory().buildMany(3);
    render(
      <div data-testid="user-list">
        {users.map(user => (
          <div key={user.id} data-testid={`user-${user.id}`}>
            {user.name}
          </div>
        ))}
      </div>
    );

    users.forEach(user => {
      expect(screen.getByTestId(`user-${user.id}`)).toHaveTextContent(user.name);
    });
  });
}); 