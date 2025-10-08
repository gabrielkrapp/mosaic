'use client';

import { Tile } from '@/types/tile';
import { useState, useEffect } from 'react';
import { msUntil, formatCountdown } from '@/lib/time';
import { maskLink } from '@/lib/format';
import { calcPrice, PRICE_PER_DAY, TEXT_LIMITS } from '@/lib/price';
import { initiatePayment } from '@/lib/worldpay';

interface TileSheetProps {
  tile: Tile | null;
  onClose: () => void;
  onPurchase: (tile: Tile, text: string, link: string, days: number) => Promise<void>;
}

export default function TileSheet({ tile, onClose, onPurchase }: TileSheetProps) {
  const [days, setDays] = useState(1);
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [countdown, setCountdown] = useState('');
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);

  const isOccupied = tile?.text;
  const totalPrice = tile ? calcPrice(tile.size, days) : 0;
  const maxChars = tile ? TEXT_LIMITS[tile.size] : 0;

  useEffect(() => {
    if (tile) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [tile]);

  useEffect(() => {
    if (!tile?.expiresAt) return;

    const interval = setInterval(() => {
      const ms = msUntil(tile.expiresAt);
      if (ms > 0) {
        setCountdown(formatCountdown(ms));
      } else {
        setCountdown('Expired');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [tile]);

  const handleTextChange = (value: string) => {
    // Limita o tamanho no próprio handler
    const trimmedValue = value.slice(0, maxChars);
    setText(trimmedValue);
    
    // Limpa qualquer erro de tamanho se estava mostrando
    if (error && error.includes('Text too long')) {
      setError('');
    }
  };

  const handleLinkChange = (value: string) => {
    setLink(value);
    if (value && !value.startsWith('https://') && !value.startsWith('worldapp://')) {
      setError('Link must start with https:// or worldapp://');
    } else {
      setError('');
    }
  };

  const handlePayment = async () => {
    if (!tile) return;

    if (!text.trim()) {
      setError('Please enter text for your ad');
      return;
    }

    if (text.length > maxChars) {
      setError(`Text too long (max ${maxChars})`);
      return;
    }

    if (link && !link.startsWith('https://') && !link.startsWith('worldapp://')) {
      setError('Invalid link format');
      return;
    }

    setPaying(true);
    try {
      const payload = await initiatePayment(totalPrice, `Mosaic spot #${tile.id} - ${days} day${days > 1 ? 's' : ''}`);
      
      if (payload.finalPayload.status === 'success') {
        // Pagamento confirmado - ativa automaticamente
        await onPurchase(tile, text.trim(), link.trim(), days);
        onClose();
      } else {
        setError('Payment was cancelled');
        setPaying(false);
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed');
      setPaying(false);
    }
  };

  if (!tile) return null;

  const sizeName = tile.size === 'S' ? 'Small' : tile.size === 'M' ? 'Medium' : 'Large';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '500px',
          backgroundColor: 'white',
          color: 'black',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflowY: 'auto',
          maxHeight: '90vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#e5e7eb',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>

        <div style={{ padding: '32px' }}>
          {isOccupied ? (
            <>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ 
                  display: 'inline-block',
                  padding: '4px 12px',
                  backgroundColor: '#d1fae5',
                  color: '#065f46',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: '9999px',
                  marginBottom: '16px'
                }}>
                  Active
                </div>
                <h2 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '8px' }}>{tile.text}</h2>
                {tile.link && (
                  <a 
                    href={tile.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#2563eb', textDecoration: 'underline', fontSize: '14px' }}
                  >
                    {maskLink(tile.link)}
                  </a>
                )}
              </div>

              <div style={{ backgroundColor: '#f3f4f6', borderRadius: '12px', padding: '16px', marginBottom: '32px' }}>
                <div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>Expires in</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{countdown}</div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                {tile.link && (
                  <a
                    href={tile.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      height: '48px',
                      backgroundColor: 'black',
                      color: 'white',
                      fontWeight: 600,
                      borderRadius: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none'
                    }}
                  >
                    Visit Link
                  </a>
                )}
                <button
                  onClick={onClose}
                  style={{
                    height: '48px',
                    padding: '0 24px',
                    backgroundColor: '#e5e7eb',
                    color: 'black',
                    fontWeight: 600,
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '8px' }}>Buy This Spot</h2>
              <p style={{ color: '#6b7280', marginBottom: '32px' }}>
                {sizeName} • {PRICE_PER_DAY[tile.size]} WLD/day
              </p>

              <div style={{ 
                backgroundColor: '#f3f4f6',
                border: '2px dashed #d1d5db',
                borderRadius: '12px',
                padding: '32px',
                marginBottom: '24px',
                minHeight: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {text ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>{text}</div>
                    {link && <div style={{ fontSize: '14px', color: '#6b7280' }}>{maskLink(link)}</div>}
                  </div>
                ) : (
                  <div style={{ color: '#9ca3af' }}>Your ad preview</div>
                )}
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Duration</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                  {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDays(d)}
                      style={{
                        height: '40px',
                        borderRadius: '8px',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: days === d ? 'black' : '#e5e7eb',
                        color: days === d ? 'white' : '#374151'
                      }}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                  Ad Text
                  <span style={{ float: 'right', color: '#6b7280' }}>
                    {text.length}/{maxChars}
                  </span>
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder={`Max ${maxChars} characters`}
                  style={{
                    width: '100%',
                    height: '48px',
                    padding: '0 16px',
                    backgroundColor: '#f3f4f6',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: 600
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                  Link (optional)
                </label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => handleLinkChange(e.target.value)}
                  placeholder="https://your-link.com"
                  style={{
                    width: '100%',
                    height: '48px',
                    padding: '0 16px',
                    backgroundColor: '#f3f4f6',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px'
                  }}
                />
              </div>

              {error && (
                <div style={{ 
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fcd34d',
                  color: '#92400e',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '24px',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}

              <div style={{ backgroundColor: '#f3f4f6', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 500 }}>Total</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalPrice} WLD</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{days} day{days > 1 ? 's' : ''}</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handlePayment}
                  disabled={!text.trim() || !!error || paying}
                  style={{
                    flex: 1,
                    height: '48px',
                    backgroundColor: (!text.trim() || !!error || paying) ? '#d1d5db' : 'black',
                    color: (!text.trim() || !!error || paying) ? '#6b7280' : 'white',
                    fontWeight: 600,
                    borderRadius: '12px',
                    border: 'none',
                    cursor: (!text.trim() || !!error || paying) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {paying ? 'Processing...' : 'Pay'}
                </button>
                <button
                  onClick={onClose}
                  disabled={paying}
                  style={{
                    height: '48px',
                    padding: '0 20px',
                    backgroundColor: '#e5e7eb',
                    color: 'black',
                    fontWeight: 600,
                    borderRadius: '12px',
                    border: 'none',
                    cursor: paying ? 'not-allowed' : 'pointer',
                    opacity: paying ? 0.5 : 1
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
