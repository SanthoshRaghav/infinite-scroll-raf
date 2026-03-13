import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const LIMIT = 25;

export default function App() {
  const [numbers, setNumbers] = useState(() =>
    Array.from({ length: LIMIT }, (_, i) => i)
  );
  const feedAreaRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const isFetchingRef = useRef(false);
  const tickingRef = useRef(false);

  useEffect(() => {
    const el = feedAreaRef.current;

    const fetchMore = async () => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 2000));
      setNumbers((prev) => [
        ...prev,
        ...Array.from({ length: LIMIT }, (_, i) => prev.length + i),
      ]);
      setIsLoading(false);
      isFetchingRef.current = false;
    };

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        tickingRef.current = false;
        const { clientHeight, scrollTop, scrollHeight } = el;
        if (clientHeight + scrollTop + 5 >= scrollHeight) {
          fetchMore(); // separate async function
        }
      });
    };

    el.addEventListener('scroll', handleScroll);
    return () => {
      el.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="feed">
      <h1 className="feed-title">Posts</h1>
      <div ref={feedAreaRef} className="feed-area">
        <ul className="feed-list">
          {numbers.map((number) => (
            <Item key={number} number={number} />
          ))}
        </ul>
        {isLoading && <p className="feed-status">Loading...</p>}
      </div>
    </section>
  );
}

const Item = React.memo(function Item({ number }) {
  return <li className="feed-item">{number + 1}</li>;
});
