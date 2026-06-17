import { useState } from 'react'
import './screens.css'

export default function AdminScreen({ user, T }) {
  const [activeTab, setActiveTab] = useState('content')

  return (
    <div className="screen">
      <h1 className="screen-title">⚙️ Admin Panel</h1>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border)' }}>
        <button
          className={`btn ${activeTab === 'content' ? 'btn-primary' : 'btn-outline'} btn-sm`}
          onClick={() => setActiveTab('content')}
        >
          Kontent
        </button>
        <button
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'} btn-sm`}
          onClick={() => setActiveTab('users')}
        >
          Foydalanuvchilar
        </button>
        <button
          className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-outline'} btn-sm`}
          onClick={() => setActiveTab('settings')}
        >
          Sozlamalar
        </button>
      </div>

      {activeTab === 'content' && (
        <div>
          <div className="card">
            <h3>Biletlar boshqarish</h3>
            <p>Biletlar va savollarni qo'shish, tahrirlash, o'chirish</p>
            <button className="btn btn-primary">Biletlarni boshqarish</button>
          </div>
          <div className="card">
            <h3>Mavzular boshqarish</h3>
            <p>Mavzular va kategoriyalarni boshqarish</p>
            <button className="btn btn-primary">Mavzularni boshqarish</button>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card">
          <h3>Foydalanuvchilar</h3>
          <p>Ro'yxatdan o'tgan foydalanuvchilar: 1,234</p>
          <p>Pro obuna egalar: 89</p>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="card">
          <h3>Tizim Sozlamalari</h3>
          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', marginBottom: '12px' }}>
              <input type="checkbox" defaultChecked /> Ro'yxatdan o'tishni yoqish
            </label>
            <label style={{ display: 'block', marginBottom: '12px' }}>
              <input type="checkbox" defaultChecked /> Imtihonlarni yoqish
            </label>
          </div>
        </div>
      )}
    </div>
  )
}
