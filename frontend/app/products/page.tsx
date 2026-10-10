
'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const fetchProducts = async () => {
    const res = await api.get('/api/products');
    setProducts(res.data);
  };

  useEffect(() => { 
    fetchProducts(); 
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await toast.promise(
        api.post('/api/products', { name, price }),
        {
          loading: 'Đang lưu...',
          success: 'Lưu thành công!',
          error: 'Có lỗi xảy ra!',
        }
      );
      setName(''); 
      setPrice('');
      fetchProducts();
    } catch (err: any) {
      console.error(err.response?.data?.error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn chắc chắn muốn xoá?')) return;
    try {
      await api.delete(`/api/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Đã xoá sản phẩm');
    } catch (err) {
      toast.error('Xoá thất bại, thử lại!');
      fetchProducts();
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder='Tên SP' 
        />
        <input 
          value={price} 
          onChange={e => setPrice(e.target.value)} 
          placeholder='Giá' 
          type='number' 
        />
        <button type='submit'>Thêm sản phẩm</button>
      </form>

      {products.map(p => (
        <div key={p.id} className='flex justify-between items-center p-3 border rounded mb-2'>
          <span>{p.name} - {p.price.toLocaleString()}</span>
          <button 
            onClick={() => handleDelete(p.id)} 
            className='text-red-500 hover:text-red-700 text-sm font-medium'
          >
            Xoá
          </button>
        </div>
      ))}
    </div>
  );
}