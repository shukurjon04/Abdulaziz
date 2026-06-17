import './screens.css'

export default function StatsScreen({ T }) {
  return (
    <div className="screen">
      <h1 className="screen-title">📊 Statistika</h1>

      <div className="stats-container">
        <div className="stats-box">
          <h3>Jami Savollar</h3>
          <div className="big-number">2,456</div>
        </div>
        <div className="stats-box">
          <h3>To'g'ri Javoblar</h3>
          <div className="big-number">1,789</div>
        </div>
        <div className="stats-box">
          <h3>Xato Javoblar</h3>
          <div className="big-number">667</div>
        </div>
        <div className="stats-box">
          <h3>Aniqlik %</h3>
          <div className="big-number">72.8%</div>
        </div>
      </div>

      <div className="card">
        <h3>Mavzular bo'yicha Tahlil</h3>
        <div style={{ marginTop: '16px' }}>
          <p>Qo'shimcha statistika tez orada mavjud bo'ladi...</p>
        </div>
      </div>
    </div>
  )
}
