import './screens.css'

export default function TestsScreen({ setScreen, T }) {
  return (
    <div className="screen">
      <h1 className="screen-title">✍️ Testlar</h1>
      <div className="card">
        <h3>Cheksiz Testlar</h3>
        <p>Barcha mavzudan aralash savollar</p>
        <button className="btn btn-primary" onClick={() => setScreen('test-quiz')}>
          Testni boshlash
        </button>
      </div>
    </div>
  )
}
