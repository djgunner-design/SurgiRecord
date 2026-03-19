'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Delete } from 'lucide-react'

const users = [
  { id: '1', name: 'David Gunn', initials: 'DG', pin: '3034' },
  { id: '2', name: 'Dr David Sharp', initials: 'DS', pin: '1234' },
  { id: '3', name: 'Anna-Louise Munro', initials: 'ALM', pin: '5678' },
  { id: '4', name: 'Kerry Lentini', initials: 'KLE', pin: '1111' },
  { id: '5', name: 'Emma Layt', initials: 'ELT', pin: '2222' },
  { id: '6', name: 'Monica Roberts', initials: 'MOR', pin: '3333' },
  { id: '7', name: 'Gary Cadwallender', initials: 'GCA', pin: '4444' },
]

export default function LoginPage() {
  const [selectedUser, setSelectedUser] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num)
    }
  }

  const handleClear = () => {
    setPin('')
    setError('')
  }

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1))
    setError('')
  }

  const handleLogin = () => {
    if (!selectedUser) {
      setError('Please select a user')
      return
    }
    const user = users.find(u => u.id === selectedUser)
    if (!user) return

    if (user.pin === pin) {
      document.cookie = `userId=${user.id}; path=/`
      document.cookie = `userName=${user.name}; path=/`
      document.cookie = `userInitials=${user.initials}; path=/`
      router.push('/dashboard')
    } else {
      setError('Incorrect PIN')
      setPin('')
    }
  }

  // Auto-submit when 4 digits entered
  if (pin.length === 4 && selectedUser) {
    const user = users.find(u => u.id === selectedUser)
    if (user && user.pin === pin) {
      document.cookie = `userId=${user.id}; path=/`
      document.cookie = `userName=${user.name}; path=/`
      document.cookie = `userInitials=${user.initials}; path=/`
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-600 to-blue-800">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-100 mb-4">
            <Lock className="w-8 h-8 text-cyan-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">SurgiRecord</h1>
          <p className="text-gray-500 mt-1">Theatre Management System</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select User</label>
          <select
            value={selectedUser}
            onChange={(e) => { setSelectedUser(e.target.value); setError(''); setPin('') }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-gray-900"
          >
            <option value="">Choose your name...</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.initials})</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Enter PIN</label>
          <div className="flex justify-center gap-3 mb-4">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl font-bold transition-all ${
                  pin.length > i
                    ? 'border-cyan-500 bg-cyan-500 text-white'
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                {pin.length > i ? '•' : ''}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="h-14 rounded-xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-xl font-semibold text-gray-800 transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="h-14 rounded-xl bg-red-100 hover:bg-red-200 text-sm font-semibold text-red-600 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => handleNumberClick('0')}
            className="h-14 rounded-xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-xl font-semibold text-gray-800 transition-colors"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors flex items-center justify-center"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl transition-colors"
        >
          Sign In
        </button>
      </div>
    </div>
  )
}
