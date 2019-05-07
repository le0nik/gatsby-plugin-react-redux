import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

function MainPage() {
  const message = useSelector(state => state.message);
  const dispatch = useDispatch();
  const handleSubmit = useCallback(
    event => {
      event.preventDefault();
    },
    [dispatch],
  );

  const handleChange = useCallback(
    event => {
      dispatch({
        type: 'SET_MESSAGE',
        message: event.target.value || '',
      });
    },
    [dispatch],
  );

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p>
          <label htmlFor="message">Type your message: </label>
          <input
            id="message"
            name="message"
            type="text"
            onChange={handleChange}
          />
        </p>
        <button type="submit">Update</button>
      </form>
      <hr />
      <p>Message is: "{message}"</p>
    </div>
  );
}

export default MainPage;
