import { useState } from 'react';
import { Observable } from 'rxjs';

function App() {
  const [number, setNumber] = useState(0);
  const [subscription, setSubscription] = useState(null);

  const observable = new Observable((observer) => {
    const eventSource = new EventSource("http://localhost:9000");

    eventSource.onmessage = (evt) => observer.next(evt.data);
    eventSource.onerror = (err) => observer.error(err);

    return () => {
      eventSource.close();
    }
  })

  const subscribe = () => {
    setSubscription(observable.subscribe({
      next: (data) => {
        setNumber((JSON.parse(data)).content);
      },
      error: (err) => {
        console.error(err);
        subscription?.unsubscribe();
      },
    }));
  }

  const unsubscribe = () => {
    subscription?.unsubscribe();
    setSubscription(null)
  }

  return (
    <div className="App">
      <div>{ subscription ? `Server is running for ${number} seconds.` : `Subscribe to see how long the server has been kept running` }</div>
      
      <button onClick={() => subscribe()}>Subscribe</button>
      <button onClick={() => unsubscribe()}>Unsubscribe</button>
    </div>
  );
}

export default App;
