import './screens.css'

export default function ExamScreen({ setScreen, T }) {
  const rules = [
    '20 ta savol beriladi',
    'Har bir savolga 1 daqiqa',
    '2 tadan ortiq xato bo\'lsa imtihondan o\'ta olmaysiz',
    'Imtihon yakunida natija va statistika ko\'rsatiladi',
  ]

  return (
    <div className="screen">
      <h1 className="screen-title">📝 Rasmiy Imtihon</h1>

      <div className="card">
        <h3>Imtihon Qoidalari</h3>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '16px' }}>
          {rules.map((rule, idx) => (
            <li key={idx} style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>✓</span>
              {rule}
            </li>
          ))}
        </ul>
      </div>

      <button className="btn btn-primary btn-lg" onClick={() => setScreen('exam-quiz')} style={{ marginTop: '20px', width: '100%' }}>
        Imtihonni boshlash
      </button>
    </div>
  )
}
