import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
  waitForElement,
} from '@testing-library/react';
import 'jest-dom/extend-expect';

import { useLoader } from './index';

function MockLoader({ fetch }) {
  const [id, setId] = React.useState(1);
  const { data, isLoading, refresh } = useLoader(fetch, [id]);
  return (
    <div>
      {!isLoading && <p data-testid="result">{data}</p>}
      <button type="button" onClick={refresh}>
        refresh
      </button>
      {/* update a dependency of the loader */}
      <button type="button" onClick={() => setId(id + 1)}>
        update
      </button>
    </div>
  );
}

describe('useLoader', () => {
  afterEach(cleanup);

  // This throws a warning:
  // Warning: An update to MockLoader inside a test was not wrapped in act
  // Couldn't find a way around it https://github.com/testing-library/react-testing-library/issues/281#issuecomment-461150694
  it('calls fetch a single time when loaded', async () => {
    const DATA = 101;
    const mockCallback = jest.fn(x => DATA);
    const { getByTestId } = render(<MockLoader fetch={mockCallback} />);
    await waitForElement(() => getByTestId('result'));
    expect(getByTestId('result')).toHaveTextContent(DATA);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('calls fetch when refresh is executed', async () => {
    let data = 101;
    const mockCallback = jest.fn(x => data);
    const { getByTestId, getByText } = render(
      <MockLoader fetch={mockCallback} />
    );
    await waitForElement(() => getByTestId('result'));

    // modify the response
    data = 'another value';
    fireEvent.click(getByText(/refresh/i));
    await waitForElement(() => getByTestId('result'));

    expect(getByTestId('result')).toHaveTextContent(data);
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  it('calls fetch when a dependency changes', async () => {
    let data = 101;
    const mockCallback = jest.fn(x => data);
    const { getByTestId, getByText } = render(
      <MockLoader fetch={mockCallback} />
    );
    await waitForElement(() => getByTestId('result'));

    // this updates `id` which is one of the dependencies of the effect
    data = 'another value';
    fireEvent.click(getByText(/update/i));
    await waitForElement(() => getByTestId('result'));

    expect(getByTestId('result')).toHaveTextContent(data);
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });
});
