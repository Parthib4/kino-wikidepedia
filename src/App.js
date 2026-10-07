import { useState } from 'react';
import './App.css';

const WIKIPEDIA_API =
  'https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=1&format=json&origin=*&srlimit=20&srsearch=';

function App() {
  const [query, setQuery] = useState('');
  const [searchedQuery, setSearchedQuery] = useState('');
  const [results, setResults] = useState([]);
  const [totalHits, setTotalHits] = useState(0);
  const [status, setStatus] = useState('initial');
  const [error, setError] = useState('');

  async function searchWikipedia(event) {
    event.preventDefault();
    const searchTerm = query.trim();
    if (!searchTerm) return;

    setStatus('loading');
    setError('');
    setResults([]);
    setSearchedQuery(searchTerm);

    try {
      const response = await fetch(`${WIKIPEDIA_API}${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error(`Wikipedia returned HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.info || 'Wikipedia API error');
      }

      const articles = data.query?.search || [];
      setResults(articles);
      setTotalHits(data.query?.searchinfo?.totalhits || 0);
      setStatus(articles.length ? 'results' : 'empty');
    } catch (searchError) {
      console.error('Wikipedia search failed:', searchError);
      setError('Failed to fetch results. Please check your connection and try again.');
      setStatus('error');
    }
  }

  function resetSearch() {
    setQuery('');
    setSearchedQuery('');
    setResults([]);
    setError('');
    setStatus('initial');
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <button className="brand" type="button" onClick={resetSearch} aria-label="Reset search">
            <span className="brand-mark">W</span>
            <span className="brand-name">KinoWiki</span>
          </button>
          <form className="search-form" onSubmit={searchWikipedia}>
            <i className="fa-solid fa-search search-icon" aria-hidden="true" />
            <input
              aria-label="Search Wikipedia"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Explore an idea..."
              autoComplete="off"
            />
            {query && (
              <button
                className="clear-button"
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
              >
                <i className="fa-solid fa-times" aria-hidden="true" />
              </button>
            )}
          </form>
        </div>
      </header>

      <main className="main-content">
        {status === 'initial' && (
          <section className="empty-state">
            <i className="fa-solid fa-book-open empty-icon" aria-hidden="true" />
            <h1>Explore the world with KinoWiki</h1>
            <p>Search millions of encyclopedia articles using a calm, focused reading experience.</p>
          </section>
        )}

        {status === 'loading' && (
          <section className="empty-state" aria-live="polite">
            <div className="spinner" />
            <p>Searching articles...</p>
          </section>
        )}

        {status === 'error' && <p className="error-message" role="alert">{error}</p>}

        {status === 'empty' && (
          <p className="error-message" role="alert">
            No articles found matching &quot;{searchedQuery}&quot;. Try different keywords.
          </p>
        )}

        {status === 'results' && (
          <>
            <div className="results-header">
              <h2>Search Results for &quot;{searchedQuery}&quot;</h2>
              <span>{totalHits.toLocaleString()} results</span>
            </div>
            <div className="results">
              {results.map((result) => (
                <article className="result-card" key={result.pageid}>
                  <a
                    href={`https://en.wikipedia.org/?curid=${result.pageid}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <h3>{result.title} <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" /></h3>
                    <p dangerouslySetInnerHTML={{ __html: `${result.snippet}...` }} />
                    <small>Article ID: {result.pageid} · en.wikipedia.org</small>
                  </a>
                </article>
              ))}
            </div>
          </>
        )}
      </main>

      <footer>Search data provided by the <a href="https://en.wikipedia.org/" target="_blank" rel="noreferrer">Wikipedia API</a>.</footer>
    </div>
  );
}

export default App;
