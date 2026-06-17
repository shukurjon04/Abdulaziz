import './screens.css'

export default function ProfileScreen({ user, onLogout, T }) {
  return (
    <div className="screen">
      <h1 className="screen-title">👤 Profil</h1>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            color: 'white',
          }}>
            👤
          </div>
          <div>
            <h2>{user?.firstName} {user?.lastName || ''}</h2>
            <p style={{ color: 'var(--gray-500)' }}>{user?.email}</p>
          </div>
        </div>

        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: '12px' }}>Profil Tafsilotlari</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--gray-500)', textTransform: 'uppercase' }}>ID</label>
              <p>{user?.id}</p>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Status</label>
              <p>{user?.isPro ? '👑 Pro' : 'Standart'}</p>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--gray-500)', textTransform: 'uppercase' }}>A'zo bo'lgan sana</label>
              <p>{new Date().toLocaleDateString('uz-UZ')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3 style={{ marginBottom: '12px' }}>Sozlamalar</h3>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span>Bildirishnomalar</span>
          <input type="checkbox" defaultChecked />
        </label>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span>Email xabarlar</span>
          <input type="checkbox" defaultChecked />
        </label>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Analitika</span>
          <input type="checkbox" defaultChecked />
        </label>
      </div>

      <button className="btn btn-danger btn-block" onClick={onLogout} style={{ marginTop: '20px' }}>
        Chiqish
      </button>
    </div>
  )
}
